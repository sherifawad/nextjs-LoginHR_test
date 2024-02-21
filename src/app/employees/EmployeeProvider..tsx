import { useToast } from "@/components/ui/use-toast";
import { Employee } from "@/validation/employeeSchema";
import { PropsWithChildren, createContext } from "react";
import {
	CreateEmployee,
	DeleteEmployee,
	GetAllEmployees,
	UpdateEmployee,
} from "../profile/_actions";

export type EmployeeContextType = {
	employees: () => Promise<Employee[]>;
	saveEmployee: (employee: Employee) => void;
	updateEmployee: (code: number, employee: Employee) => void;
	deleteEmployee: (code: number) => void;
};

export const EmployeeContext = createContext<EmployeeContextType | null>(null);

function EmployeeProvider({ children }: PropsWithChildren) {
	const { toast } = useToast();

	const employees = async () => await GetAllEmployees();
	const saveEmployee = async (employee: Employee) => {
		try {
			const result = await CreateEmployee(employee);
		} catch (error) {
			let errorMessage = error;
			if (error instanceof Error) {
				error = error.message;
			}
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${errorMessage}`,
			});
		}
	};
	const updateEmployee = async (code: number, employee: Employee) => {
		try {
			const result = await UpdateEmployee(code, employee);
		} catch (error) {
			let errorMessage = error;
			if (error instanceof Error) {
				error = error.message;
			}
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${errorMessage}`,
			});
		}
	};
	const deleteEmployee = async (code: number) => {
		try {
			const deleted = await DeleteEmployee(code);
			if (deleted) {
				toast({
					variant: "success",
					title: "Success",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error instanceof Error ? error.message : `${error}`,
			});
		}
	};
	return (
		<EmployeeContext.Provider
			value={{
				employees,
				saveEmployee,
				updateEmployee,
				deleteEmployee,
			}}
		>
			{children}
		</EmployeeContext.Provider>
	);
}

export default EmployeeProvider;
