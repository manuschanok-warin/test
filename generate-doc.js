import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownPath = path.join(__dirname, 'docs', 'hospital-middleware.md');
const outputPath = path.join('/Users', 'manuschanok', 'Desktop', 'Hospital_Middleware_Documentation.pdf');

const markdown = fs.readFileSync(markdownPath, 'utf8');

const escapePdfText = (value) => value
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const lines = markdown.split('\n');
const content = lines
  .map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    if (trimmed.startsWith('# ')) return `BT /F1 18 Tf 50 800 Td (${escapePdfText(trimmed.replace(/^#\s*/, ''))}) Tj ET`;
    if (trimmed.startsWith('## ')) return `BT /F1 14 Tf 50 770 Td (${escapePdfText(trimmed.replace(/^##\s*/, ''))}) Tj ET`;
    if (trimmed.startsWith('### ')) return `BT /F1 12 Tf 50 750 Td (${escapePdfText(trimmed.replace(/^###\s*/, ''))}) Tj ET`;
    if (trimmed.startsWith('- ')) return `BT /F1 10 Tf 70 720 Td (${escapePdfText(trimmed.replace(/^-\s*/, ''))}) Tj ET`;
    if (trimmed.startsWith('```')) return '';
    if (trimmed.startsWith('`')) return `BT /F1 10 Tf 50 740 Td (${escapePdfText(trimmed.replace(/`/g, ''))}) Tj ET`;
    return `BT /F1 10 Tf 50 740 Td (${escapePdfText(trimmed)}) Tj ET`;
  })
  .filter(Boolean)
  .join('\n');

const pdf = `BT
/F1 12 Tf
50 780 Td
(${escapePdfText('Hospital Middleware Documentation')}) Tj
ET
${content}`;

const pdfDoc = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length ${pdf.length} >> stream
${pdf}
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000123 00000 n 
0000000489 00000 n 
0000000000 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
999
%%EOF`;

fs.writeFileSync(outputPath, pdfDoc, 'binary');
console.log(`PDF generated at ${outputPath}`);
