import { useToast } from "@/components/ui/use-toast";
import { FilterItemObject } from "@/validation/filter-validation";
import { Employee } from "@/validation/generated-zod-schemas";
import { createContext, useCallback, useState } from "react";

export type EmployeeContext = {
	filterList: FilterItemObject<Employee>[];
	addEmployeesFilter: (filter: FilterItemObject<Employee>) => Promise<void>;
	deleteEmployeesFilter: (filter: FilterItemObject<Employee>) => Promise<void>;
};

export const EmployeeContext = createContext<EmployeeContext | null>(null);

const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { toast } = useToast();
	const [filterList, setFilterList] = useState<FilterItemObject<Employee>[]>(
		[],
	);
	const addEmployeesFilter = useCallback(
		async (filter: FilterItemObject<Employee>) => {
			try {
				const match = filterList.some(
					f =>
						f.Operator === filter.Operator &&
						f.Property === filter.Property &&
						filter.Value[0].label === f.Value[0].label,
				);
				if (match) {
					toast({
						variant: "destructive",
						title: "Filter Dublicate",
						// description: "Fill All Filter Data",
					});
					return;
				}
				setFilterList([...filterList, filter]);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "SomeThing wrong",
					description: error instanceof Error ? error.message : `${error}`,
				});
			}
		},
		[filterList, toast],
	);
	const deleteEmployeesFilter = useCallback(
		async (filter: FilterItemObject<Employee>) => {
			try {
				const list = filterList.filter(
					f =>
						f.Operator !== filter.Operator &&
						f.Property !== filter.Property &&
						filter.Value[0].label !== f.Value[0].label,
				);

				setFilterList(list);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "SomeThing wrong",
					description: error instanceof Error ? error.message : `${error}`,
				});
			}
		},
		[filterList, toast],
	);

	return (
		<EmployeeContext.Provider
			value={{
				addEmployeesFilter,
				deleteEmployeesFilter,
				filterList,
			}}
		>
			{children}
		</EmployeeContext.Provider>
	);
};

export default EmployeeProvider;
