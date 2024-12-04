import fastify from 'fastify';
import { config } from './env';
import MovieDbClient from './movieDbClient';

const app = fastify({ logger: true });
const movieDbClient = new MovieDbClient();

app.get('/', async (request, reply) => {
  const popularMovies = await movieDbClient.discoverMovies();
  reply.send(popularMovies);
});

const start = async () => {
  try {
    await app.listen({
      port: config.PORT,
    });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
