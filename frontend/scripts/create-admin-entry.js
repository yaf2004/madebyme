import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const adminDir = path.join(dist, 'admin');

await mkdir(adminDir, { recursive: true });
await copyFile(path.join(dist, 'index.html'), path.join(adminDir, 'index.html'));
console.log('Created /admin static entry point.');
