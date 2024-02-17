import { z } from "zod";
import { FilterComparison } from "./components/filters/comparisonSelections/selections/comparisonSelections/comparisonSchema";
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
	z.string().array().min(1),
	z.string().min(1),
]);
export type BasicValues = z.infer<typeof BasicValues>;

const OptionValue = z.coerce.string().min(1);

export const FilterOption = z.object({
	label: z.string().min(1),
	value: OptionValue,
});

// export type SelectionType = { label: string; value: string | number | Date };
export type FilterOption = z.infer<typeof FilterOption>;

export const Filter = z.object({
	property: FilterOption,
	operation: FilterOption,
	data: BasicValues,
});
export type Filter = z.infer<typeof Filter>;

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
	valueB: BasicValues,
	operation: FilterComparison,
	valueC: BasicValues.optional(),
});

export type EmployeeFilterOperation = z.infer<typeof EmployeeFilterOperation>;
