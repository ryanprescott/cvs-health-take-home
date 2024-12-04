import axios from 'axios';
import { config } from './env';

class MovieDbClient {
  private version = '3';
  private client = axios.create({
    baseURL: new URL(this.version, config.MOVIE_DB_API_BASE_URL).toString(),
    headers: {
      Authorization: `Bearer ${config.MOVIE_DB_API_KEY}`,
    },
  });

  async discoverMovies() {
    const response = await this.client.get('/discover/movie');
    return response.data;
  }
  async movieCredits(movieId: string) {
    const response = await this.client.get(`/movie/${movieId}/credits`);
    return response.data;
  }
}

export default MovieDbClient;
