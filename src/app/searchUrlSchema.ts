import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);

export const BasicSearchParamsSchema = z.object({
	sort: sortingSchema.optional(),
	employee: z.string().optional(),
	filter: z.string().optional(),
	// filter: z
	// 	.string()
	// 	.optional()
	// 	.transform(val => (val ? splitStringToArray(val, ",") : undefined))
	// 	.pipe(z.custom<keyof Employee>().array().optional()),
});
