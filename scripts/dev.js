#!/usr/bin/env node

const { spawn } = require('child_process');
const detect = require('detect-port-alt');

const DEFAULT_PORT = 9002;

async function findAvailablePort(startPort) {
  try {
    const port = await detect(startPort);
    if (port === startPort) {
      console.log(`✅ Использую порт ${port}`);
    } else {
      console.log(`⚠️  Порт ${startPort} занят, использую порт ${port}`);
    }
    return port;
  } catch (error) {
    console.error('Ошибка при поиске свободного порта:', error);
    process.exit(1);
  }
}

async function startDev() {
  const port = await findAvailablePort(DEFAULT_PORT);
  
  const nextProcess = spawn('next', ['dev', '--turbopack', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true
  });

  nextProcess.on('error', (error) => {
    console.error('Ошибка при запуске Next.js:', error);
    process.exit(1);
  });

  nextProcess.on('exit', (code) => {
    process.exit(code);
  });
}

startDev();