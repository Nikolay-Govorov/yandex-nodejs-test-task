const http = require('http');

const server = http.createServer((request, response) => {
  response.end('Welcome to my simple server');
});

server.listen(3000, 'localhost', (error) => {
  if (error) {
    console.error('Error starting the server:', error); return;
  }

  console.log('Server started');
});
