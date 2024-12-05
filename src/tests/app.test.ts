import fastify from 'fastify';
import movieRoutes from '../app';
import MovieDbClient from '../movieDbClient';
import { CrewMember, Movie, MovieCreditsResponse } from '../schema/movieDb';

jest.mock('../movieDbClient'); // Mock the MovieDbClient to isolate functionality

const mockDiscoverMovie = jest.fn();
const mockMovieCredits = jest.fn();

(MovieDbClient as jest.Mock).mockImplementation(() => ({
  discoverMovie: mockDiscoverMovie,
  movieCredits: mockMovieCredits,
}));

describe('Fastify App', () => {
  const server = fastify();

  const mockMoviesData = (movies: Movie[]) => {
    mockDiscoverMovie.mockResolvedValue({ results: movies });
  };

  const mockCreditsData = (credits: MovieCreditsResponse[]) => {
    mockMovieCredits
      .mockImplementationOnce(() => Promise.resolve(credits[0]))
      .mockImplementationOnce(() => Promise.resolve(credits[1]));
  };

  const mockSingleCreditData = (credits: MovieCreditsResponse) => {
    mockMovieCredits.mockResolvedValue(credits);
  };

  beforeAll(async () => {
    await server.register(movieRoutes);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should fetch movies and their editors', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
      } as Movie,
      {
        id: 2,
        title: 'Movie 2',
        release_date: '2023-02-01',
        vote_average: 7.5,
      } as Movie,
    ];

    const mockCredits: MovieCreditsResponse[] = [
      {
        id: 1,
        cast: [],
        crew: [
          { name: 'Editor 1', department: 'Editing' },
          { name: 'Director 1', department: 'Directing' },
        ] as CrewMember[],
      },
      {
        id: 2,
        cast: [],
        crew: [
          { name: 'Editor 2', department: 'Editing' },
          { name: 'Editor 3', department: 'Editing' },
        ] as CrewMember[],
      },
    ];

    mockMoviesData(mockMovies);
    mockCreditsData(mockCredits);

    const response = await server.inject({
      method: 'GET',
      url: '/?year=2023',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
        editors: ['Editor 1'],
      },
      {
        title: 'Movie 2',
        release_date: '2023-02-01',
        vote_average: 7.5,
        editors: ['Editor 2', 'Editor 3'],
      },
    ]);
  });

  it('should handle movies with no editors', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
      } as Movie,
    ];

    const mockCredits: MovieCreditsResponse = {
      id: 1,
      cast: [],
      crew: [{ name: 'Director 1', department: 'Directing' }] as CrewMember[],
    };

    mockMoviesData(mockMovies);
    mockSingleCreditData(mockCredits);

    const response = await server.inject({
      method: 'GET',
      url: '/?year=2023',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
        editors: [],
      },
    ]);
  });

  it('should log errors for failed credits fetch', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
      } as Movie,
    ];

    mockMoviesData(mockMovies);
    mockMovieCredits.mockRejectedValue(new Error('Failed to fetch credits'));

    const response = await server.inject({
      method: 'GET',
      url: '/?year=2023',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
        editors: [],
      },
    ]);
  });

  it('should return 400 for missing year parameter', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for invalid year parameter', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/?year=invalidYear',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return an empty array if no movies are found', async () => {
    mockMoviesData([]);

    const response = await server.inject({
      method: 'GET',
      url: '/?year=2023',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should handle movies with multiple editors', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
      } as Movie,
    ];

    const mockCredits: MovieCreditsResponse[] = [
      {
        id: 1,
        cast: [],
        crew: [
          { name: 'Editor 1', department: 'Editing' },
          { name: 'Editor 2', department: 'Editing' },
        ] as CrewMember[],
      },
    ];

    mockMoviesData(mockMovies);
    mockCreditsData(mockCredits);

    const response = await server.inject({
      method: 'GET',
      url: '/?year=2023',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        title: 'Movie 1',
        release_date: '2023-01-01',
        vote_average: 8.0,
        editors: ['Editor 1', 'Editor 2'],
      },
    ]);
  });
});
