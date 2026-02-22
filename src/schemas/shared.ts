import z from "zod";

export const Pagination = z.object({
  offset: z.coerce.number().gte(0).default(0),
  limit: z.coerce.number().positive().max(100).default(10)
})