import { z } from "zod";
import { EmployeeSchema } from "./validation/generated-zod-schemas";

export const SalaryStatusEnum = z.enum(["VALID", "NOT_VALID"]);
export type SalaryStatusEnum = z.infer<typeof SalaryStatusEnum>;

// export type EmployeeContextType = {
// 	employees: Employee[];
// 	saveEmployee: (employee: Employee) => void;
// 	updateEmployee: (code: number, data: UpdatedEmployee) => void;
// 	deleteEmployee: (code: number) => void;
// 	filterEmployeesList: (filters: Partial<employeeFilter>) => Employee[];
// 	findUniqueEmployee: (code: number) => Employee | undefined;
// 	findEmployee: (filters: Partial<employeeFilter>) => Employee | undefined;
// };

export type dateInput = {
	week: number;
	month: number;
	year: number;
};

export const BasicValues = z.coerce
	.string()
	.min(1)
	.or(z.coerce.number().int().min(1).positive())
	.or(z.date())
	.or(z.object({}))
	.or(z.string().array())
	.or(z.number().array())
	.or(z.object({}).array());

export type BasicValues = z.infer<typeof BasicValues>;

export const FilterOption = z.object({
	label: z.string().min(1),
	value: BasicValues,
});
export const EmployeePropertyOption = z.object({
	label: z.custom<keyof z.infer<typeof EmployeeSchema>>(),
	value: BasicValues,
});

// export type SelectionType = { label: string; value: string | number | Date };
export type FilterOption = z.infer<typeof FilterOption>;
export type EmployeePropertyOption = z.infer<typeof EmployeePropertyOption>;

export const Filter = z.object({
	property: FilterOption,
	operation: FilterOption,
	data: BasicValues,
});
export type Filter = z.infer<typeof Filter>;

//To Show FilterValue Component
export const FilterComparison = z.enum([
	"GreaterThan",
	"LessThan",
	"Equal",
	"Not_Equal",
	"GreaterThan_Or_Equal",
	"LessThan_Or_Equal",
	"Between",
	"Not_Between",
	"InList",
	"Not_InList",
	"Include",
	"Not_Include",
	"IsBlank",
	"Is_Not_Blank",
	"Is_Null",
	"Is_Not_Null",
]);

export type FilterComparison = z.infer<typeof FilterComparison>;

export const EmployeeFilterComparisonOption = z.object({
	label: FilterComparison,
	value: BasicValues,
});
export type EmployeeFilterComparisonOption = z.infer<
	typeof EmployeeFilterComparisonOption
>;

//To Show FilterValue Component
export const FilterValueSelect = z.enum([
	"TEXT",
	"RANGE",
	"DATE",
	"DATE_RANGE",
	"LIST",
]);

export type FilterValueSelect = z.infer<typeof FilterValueSelect>;

// zod set operation Schema

export const EmployeeFilterOperation = z.object({
	valueB: BasicValues.or(BasicValues.array().nonempty()),
	operation: FilterComparison,
	valueC: BasicValues.optional(),
});

export type EmployeeFilterOperation = z.infer<typeof EmployeeFilterOperation>;

export type SelectionType = {
	label: string;
	value: string;
};
