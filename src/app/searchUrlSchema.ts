import { splitStringToArray } from "@/lib/utils/array";
import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);

export const BasicSearchParamsSchema = z.object({
	sort: sortingSchema,
	filter: z
		.string()
		.optional()
		.transform(val => (val ? splitStringToArray(val, ",") : undefined))
		.pipe(z.custom<keyof User>().array().optional()),
});
