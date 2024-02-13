import { z } from "zod";

export enum SalaryStatus {
	VALID,
	NOT_VALID,
}

export const SalaryStatusEnum = z.nativeEnum(SalaryStatus);
export type SalaryStatusEnum = z.infer<typeof SalaryStatusEnum>;

export const EmployeePosition = z.object({
	positionName: z.string().min(1),
	positionCode: z.coerce.number().int().min(1).positive(),
});
export type EmployeePosition = z.infer<typeof EmployeePosition>;

export const Employee = z.object({
	code: z.coerce.number(),
	name: z.string().min(5),
	salaryStatus: SalaryStatusEnum,
	hiringDate: z.date(),
	position: EmployeePosition,
});

export type Employee = z.infer<typeof Employee>;

export type employeeFilter = {
	[key in keyof Employee]: Employee[key];
};
export type UpdatedEmployee = Omit<Partial<Employee>, "code">;

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
	.or(z.date());

export type BasicValues = z.infer<typeof BasicValues>;
type dd = keyof z.infer<typeof Employee>;

export const FilterOption = z.object({
	label: z.string().min(1),
	value: BasicValues,
});
export const EmployeePropertyOption = z.object({
	label: z.custom<keyof z.infer<typeof Employee>>(),
	value: BasicValues,
});

// export type SelectionType = { label: string; value: string | number | Date };
export type FilterOption = z.infer<typeof FilterOption>;
export type EmployeePropertyOption = z.infer<typeof EmployeePropertyOption>;

export const Filter = z.object({
	property: FilterOption,
	operation: FilterOption,
	data: BasicValues.or(BasicValues.array().nonempty()),
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
	"InList",
	"Not_InList",
	"Contain",
	"Include",
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
export const FilterValueSelect = z.enum(["TEXT", "DATE", "DATE_RANGE", "LIST"]);

export type FilterValueSelect = z.infer<typeof FilterValueSelect>;
