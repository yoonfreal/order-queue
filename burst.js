const http = require('http');

for (let i = 1; i <= 20; i++) {
  const data = JSON.stringify({ id: i });
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
  });
  req.write(data);
  req.end();
}

console.log('Fired 20 orders');