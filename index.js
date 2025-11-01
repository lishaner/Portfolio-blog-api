const http = require('http');
const chalk = require('chalk'); // 确认这一行存在

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

server.listen(PORT, () => {
  console.log(chalk.green(`Server running at http://localhost:${PORT}/`));
});