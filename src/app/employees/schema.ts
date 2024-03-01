import { EmployeeSchema } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";
import { z } from "zod";

export const EmployeeSearchParamsSchema = Pagination(EmployeeSchema).merge(
	z.object({
		employee: z.coerce.number().optional(),
	}),
);
