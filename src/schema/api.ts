import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schema for request query parameters
export const RequestSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, 'Year must be a 4-digit number')
    .transform(Number),
});

// Zod schema for response
export const ResponseSchema = z.array(
  z.object({
    title: z.string(),
    release_date: z.string(),
    vote_average: z.number(),
    editors: z.array(z.string()),
  }),
);

export type RequestSchema = z.infer<typeof RequestSchema>;

export const RequestJsonSchema = zodToJsonSchema(RequestSchema);
export const ResponseJsonSchema = zodToJsonSchema(ResponseSchema);
