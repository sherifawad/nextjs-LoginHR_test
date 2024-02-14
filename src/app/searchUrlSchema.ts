import { splitStringToArray } from "@/lib/utils/array";
import { Employee } from "@/validation/employeeSchema";
import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);

export const BasicSearchParamsSchema = z.object({
	sort: sortingSchema,
	filter: z
		.string()
		.optional()
		.transform(val => (val ? splitStringToArray(val, ",") : undefined))
		.pipe(z.custom<keyof Employee>().array().optional()),
});
