import app from './app.js';

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('-------------------------------------------');
  console.log(`🚀 SERVER RUNNING AT http://127.0.0.1:${PORT}`);
  console.log('-------------------------------------------');
});
