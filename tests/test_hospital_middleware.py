import json
import os
import subprocess
import tempfile
import time
from pathlib import Path
from urllib import error, request

import pytest

ROOT = Path(__file__).resolve().parents[1]


def http_json(method, path, payload=None, token=None, base_url='http://127.0.0.1:4100'):
    data = None if payload is None else json.dumps(payload).encode('utf-8')
    req = request.Request(f'{base_url}{path}', data=data, method=method)
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        with request.urlopen(req, timeout=5) as resp:
            raw = resp.read().decode('utf-8')
            return resp.status, json.loads(raw) if raw else None
    except error.HTTPError as exc:
        raw = exc.read().decode('utf-8')
        return exc.code, json.loads(raw) if raw else None


@pytest.fixture
def app_server():
    db_path = Path(tempfile.gettempdir()) / 'hospital_middleware_test.db'
    if db_path.exists():
        db_path.unlink()

    env = os.environ.copy()
    env['PORT'] = '4100'
    env['DB_PATH'] = str(db_path)
    env['USE_MOCK_HIS'] = 'true'
    env['JWT_SECRET'] = 'test-secret'

    proc = subprocess.Popen(['npx', 'tsx', 'src/server.ts'], cwd=str(ROOT), env=env)

    for _ in range(60):
        try:
            status, _ = http_json('GET', '/health')
            if status == 200:
                break
        except Exception:
            time.sleep(0.25)
    else:
        proc.terminate()
        proc.wait(timeout=10)
        raise RuntimeError('Server did not start in time')

    yield proc

    proc.terminate()
    proc.wait(timeout=10)


def test_create_staff_success(app_server):
    status, body = http_json('POST', '/staff/create', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    assert status == 201
    assert body['message'] == 'Staff created successfully'
    assert body['staff']['username'] == 'staff_a'


def test_login_success(app_server):
    http_json('POST', '/staff/create', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    status, body = http_json('POST', '/staff/login', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    assert status == 200
    assert body['message'] == 'Login successful'
    assert body['token']


def test_login_rejects_wrong_credentials(app_server):
    http_json('POST', '/staff/create', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    status, body = http_json('POST', '/staff/login', {'username': 'staff_a', 'password': 'wrong-password', 'hospital': 'Hospital A'})
    assert status == 401
    assert body['message'] == 'Invalid username or password'


def test_patient_search_requires_auth(app_server):
    status, body = http_json('GET', '/patient/search?national_id=110170000001')
    assert status == 401
    assert body['message'] == 'Authentication required'


def test_staff_can_search_same_hospital_patients(app_server):
    http_json('POST', '/staff/create', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    _, login = http_json('POST', '/staff/login', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})

    status, body = http_json('GET', '/patient/search?national_id=110170000001', token=login['token'])
    assert status == 200
    assert isinstance(body, list)
    assert body[0]['national_id'] == '110170000001'


def test_staff_cannot_access_other_hospital_patients(app_server):
    http_json('POST', '/staff/create', {'username': 'staff_b', 'password': 'secret123', 'hospital': 'Hospital B'})
    _, login = http_json('POST', '/staff/login', {'username': 'staff_b', 'password': 'secret123', 'hospital': 'Hospital B'})

    status, body = http_json('GET', '/patient/search?national_id=110170000001', token=login['token'])
    assert status == 200
    assert body == []


def test_patient_search_returns_empty_when_not_found(app_server):
    http_json('POST', '/staff/create', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})
    _, login = http_json('POST', '/staff/login', {'username': 'staff_a', 'password': 'secret123', 'hospital': 'Hospital A'})

    status, body = http_json('GET', '/patient/search?national_id=999999999999', token=login['token'])
    assert status == 200
    assert body == []
