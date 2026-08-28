import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dbPath: process.env.DB_PATH ?? './data/hospital_middleware.db',
  useMockHis: process.env.USE_MOCK_HIS !== 'false',
  hisBaseUrl: process.env.HIS_BASE_URL ?? 'https://hospital-a.api.co.th',
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
};
