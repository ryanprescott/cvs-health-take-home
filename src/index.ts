import fastify from 'fastify';
import { config } from './env';
import MovieDbClient from './movieDbClient';
import { MovieCreditsResponse } from './schema/movieDb';
import {
  RequestJsonSchema,
  RequestSchema,
  ResponseJsonSchema,
} from './schema/api';

const app = fastify({ logger: true });
const movieDbClient = new MovieDbClient();

app.route({
  method: 'GET',
  url: '/',
  schema: {
    querystring: RequestJsonSchema,
    response: {
      200: ResponseJsonSchema,
    },
  },
  handler: async (request, reply) => {
    const { year } = request.query as RequestSchema;

    const movies = await movieDbClient.discoverMovie({
      page: 1,
      primary_release_year: year,
      sort_by: 'popularity.desc',
    });

    const creditsPromises = movies.results.map(({ id }) =>
      movieDbClient.movieCredits(id),
    );

    const creditsResults = await Promise.allSettled(creditsPromises);

    const responseArray = movies.results.map(
      ({ id, title, release_date, vote_average }) => {
        const creditsResult = creditsResults.find(
          (result): result is PromiseFulfilledResult<MovieCreditsResponse> =>
            result.status === 'fulfilled' && result.value?.id === id,
        );

        if (!creditsResult) {
          console.log(`Failed to fetch credits for movie ID: ${id}`);
        }

        const editors =
          creditsResult?.value.crew
            .filter(({ department }) => department === 'Editing')
            .map(({ name }) => name) ?? [];

        return {
          title,
          release_date,
          vote_average,
          editors,
        };
      },
    );

    reply.send(responseArray);
  },
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
