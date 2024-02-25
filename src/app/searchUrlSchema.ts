import { stringValuesToFilter } from "@/lib/utils/filterUtils";
import { EmployeeFilter } from "@/validation/employeeSchema";
import { z } from "zod";

export const sortingSchema = z.enum(["asc", "desc"]);

export const BasicSearchParamsSchema = z.object({
	sort: sortingSchema.optional(),
	employee: z.coerce.number().optional(),
	filter: z
		.string()
		.transform(val => stringValuesToFilter(val))
		.pipe(EmployeeFilter.array())
		.optional(),
	// filter: z
	// 	.string()
	// 	.optional()
	// 	.transform(val => (val ? splitStringToArray(val, ",") : undefined))
	// 	.pipe(z.custom<keyof Employee>().array().optional()),
});
