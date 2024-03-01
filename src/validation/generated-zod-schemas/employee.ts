import * as z from "zod";
import { CompletePosition, RelatedPositionSchema } from "./index";

export const EmployeeSchema = z.object({
	id: z.number().int(),
	code: z.number().int(),
	name: z.string(),
	salaryStatus: z.number().int(),
	hiringDate: z.date().nullish(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	positionId: z.number().int().nullish(),
});
export const EmployeeMandatorySchema = z.object({
	id: z.number().int(),
	code: z.number().int(),
	name: z.string(),
	salaryStatus: z.number().int(),
	hiringDate: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
	positionId: z.number().int(),
});
export const EmployeeOptionalSchema = z.object({
	id: z.number().int().optional(),
	code: z.number().int().optional(),
	name: z.string().optional(),
	salaryStatus: z.number().int().optional(),
	hiringDate: z.date().nullish().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	positionId: z.number().int().nullish().optional(),
});

export interface Employee extends z.infer<typeof EmployeeSchema> {}
export interface CompleteEmployee extends z.infer<typeof EmployeeSchema> {
	Position?: CompletePosition | null;
}

/**
 * RelatedEmployeeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmployeeSchema: z.ZodSchema<CompleteEmployee> = z.lazy(() =>
	EmployeeSchema.extend({
		Position: RelatedPositionSchema.nullish(),
	}),
);
