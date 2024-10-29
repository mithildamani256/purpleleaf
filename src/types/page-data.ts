import {z} from 'Zod';

export const PageDataSchema = z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    markdown: z.string(),
    screenshot: z.string().url()
});