import { z } from 'zod';

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
});

export type Movie = z.infer<typeof MovieSchema>;

export const CastMemberSchema = z.object({
  adult: z.boolean(),
  gender: z.number(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string().nullable(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  cast_id: z.number(),
  character: z.string(),
  credit_id: z.string(),
  order: z.number(),
});

export type CastMember = z.infer<typeof CastMemberSchema>;

export const CrewMemberSchema = z.object({
  adult: z.boolean(),
  gender: z.number(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string().nullable(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
  department: z.string(),
  job: z.string(),
});

export type CrewMember = z.infer<typeof CrewMemberSchema>;

export const DiscoverMoviesRequestSchema = z.object({
  page: z.number(),
  primary_release_year: z.number(),
  sort_by: z.enum([
    'original_title.asc',
    'original_title.desc',
    'popularity.asc',
    'popularity.desc',
    'revenue.asc',
    'revenue.desc',
    'primary_release_date.asc',
    'title.asc',
    'title.desc',
    'primary_release_date.desc',
    'vote_average.asc',
    'vote_average.desc',
    'vote_count.asc',
    'vote_count.desc',
  ]),
});

export type DiscoverMoviesRequest = z.infer<typeof DiscoverMoviesRequestSchema>;

export const DiscoverMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type DiscoverMoviesResponse = z.infer<
  typeof DiscoverMoviesResponseSchema
>;

export const MovieCreditsResponseSchema = z.object({
  id: z.number(),
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

export type MovieCreditsResponse = z.infer<typeof MovieCreditsResponseSchema>;
