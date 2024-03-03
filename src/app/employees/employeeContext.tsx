import { useToast } from "@/components/ui/use-toast";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { FilterItemObject } from "@/validation/filter-validation";
import { Employee } from "@/validation/generated-zod-schemas";
import { createContext, useCallback, useState } from "react";

export type EmployeeContext = {
	filterList: FilterItemObject<Employee>[];
	addEmployeesFilter: (filter: FilterItemObject<Employee>) => Promise<void>;
	deleteEmployeesFilter: (filterIndex: number) => Promise<void>;
};

export const EmployeeContext = createContext<EmployeeContext | null>(null);

const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { toast } = useToast();
	const [filterList, setFilterList] = useState<FilterItemObject<Employee>[]>(
		[],
	);
	const { setParams, deleteParams } = useSearchUrlParams();
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
				const list = [...filterList, filter];
				setParams([
					{
						filter: `{logic:{and},filters:${JSON.stringify(
							list.map(l => ({
								Property: l.Property,
								Operator: l.Operator.value,
								Value: l.Value.map(v => v.label),
							})),
						)}}`,
					},
				]);
				setFilterList(list);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "SomeThing wrong",
					description: error instanceof Error ? error.message : `${error}`,
				});
			}
		},
		[filterList, setParams, toast],
	);
	const deleteEmployeesFilter = useCallback(
		async (filterIndex: number) => {
			try {
				console.log("🚀 ~ filterList:", filterList);

				// `${item.Property}_${item.Operator}_${item.Value[0].label}`

				// const list = filterList.filter(
				// 	(f, i) =>
				// 		f.Property !== filter.Property &&
				// 		f.Operator !== filter.Operator &&
				// 		f.Value[0].label !== filter.Value[0].label,
				// );
				const list = filterList.toSpliced(filterIndex, 1);
				console.log("🚀 ~ list:", list);
				if (list.length < 1) {
					deleteParams(["filter"]);
				} else {
					setParams([
						{
							filter: `{logic:{and},filters:${JSON.stringify(
								list.map(l => ({
									Property: l.Property,
									Operator: l.Operator,
									Value: l.Value.map(v => v.label),
								})),
							)}}`,
						},
					]);
				}
				setFilterList(list);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "SomeThing wrong",
					description: error instanceof Error ? error.message : `${error}`,
				});
			}
		},
		[deleteParams, filterList, setParams, toast],
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
