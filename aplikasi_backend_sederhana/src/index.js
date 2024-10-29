import Hapi from '@hapi/hapi';
import app from './routes.js';

const server = Hapi.server({
  host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
  port: 9000,
});

server.route(app.routes);

await server.start();

console.log(`Server running on ${server.info.uri}`);
