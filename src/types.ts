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
	code: z.coerce.number().int().min(1).positive(),
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
