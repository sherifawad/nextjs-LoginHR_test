import { z } from "zod";
import { FilterComparison } from "./validation/comparisonSnema";
import { Employee } from "./validation/employeeSchema";

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

export const BasicValues = z.union([
	z.coerce.string(),
	z.coerce.date(),
	z.string().array(),
	z.date().array(),
]);

export type BasicValues = z.infer<typeof BasicValues>;

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
	data: BasicValues,
});
export type Filter = z.infer<typeof Filter>;

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
