const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = process.env.SERVICE_NAME || 'health-check';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Service is running',
    endpoints: ['/health'],
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: SERVICE_NAME,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.originalUrl} tidak tersedia`,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${SERVICE_NAME}] Server running on port ${PORT}`);
});
