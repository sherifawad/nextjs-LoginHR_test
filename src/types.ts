export type SalaryStatus = "valid" | "not-valid";

export type Employee = {
	name: string;
	salaryStatus: string;
	code: number;
	hiringDate?: Date;
	jobCode?: number;
};

export type employeeFilter = {
	[key in keyof Employee]: Employee[key];
};
export type UpdatedEmployee = Omit<Partial<Employee>, "code">;

export type EmployeeContextType = {
	employees: Employee[];
	saveEmployee: (employee: Employee) => void;
	updateEmployee: (code: number, data: UpdatedEmployee) => void;
	deleteEmployee: (code: number) => void;
	filterEmployeesList: (filters: Partial<employeeFilter>) => Employee[];
	findUniqueEmployee: (code: number) => Employee | undefined;
	findEmployee: (filters: Partial<employeeFilter>) => Employee | undefined;
};
