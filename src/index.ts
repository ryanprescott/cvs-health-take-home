import fastify from 'fastify';
import { config } from './env';
import movieRoutes from './app';

const server = fastify({ logger: true });

server.register(movieRoutes);

const start = async () => {
  try {
    await server.listen({
      port: config.PORT,
    });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
