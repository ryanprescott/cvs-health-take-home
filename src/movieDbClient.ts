import axios from 'axios';
import { config } from './env';
import {
  type DiscoverMoviesRequest,
  type DiscoverMoviesResponse,
  type MovieCreditsResponse,
  DiscoverMoviesResponseSchema,
  MovieCreditsResponseSchema,
} from './schema/movieDb';

class MovieDbClient {
  private version = '3';
  private client = axios.create({
    baseURL: new URL(this.version, config.MOVIE_DB_API_BASE_URL).toString(),
    headers: {
      Authorization: `Bearer ${config.MOVIE_DB_API_KEY}`,
    },
  });

  async discoverMovie(request: DiscoverMoviesRequest) {
    const queryParams = new URLSearchParams(
      Object.entries(request).map(([key, value]) => [key, value.toString()]),
    );
    const response = await this.client.get<DiscoverMoviesResponse>(
      '/discover/movie?' + queryParams.toString(),
    );
    DiscoverMoviesResponseSchema.parse(response.data);
    return response.data;
  }

  async movieCredits(movieId: number) {
    const response = await this.client.get<MovieCreditsResponse>(
      `/movie/${movieId}/credits`,
    );
    MovieCreditsResponseSchema.parse(response.data);
    return response.data;
  }
}

export default MovieDbClient;
