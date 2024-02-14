"use client";

import { getLabelValueList } from "@/lib/utils/filterUtils";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { useState } from "react";
import FilteredSimpleList from "../filteredList";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import FilterPopUp from "./popupFIlterForm";

export type FilterResult =
	| {
			result: "success";
	  }
	| { result: "error"; error: string };

type FilteredEmployeesProps = {
	initialEmployees: Employee[];
};

function FilteredEmployees({ initialEmployees }: FilteredEmployeesProps) {
	const { toast } = useToast();

	const [employeesList, setEmployeesList] =
		useState<Employee[]>(initialEmployees);

	const [Filters, setFilters] = useState<EmployeeFilter[]>([]);

	const addFilter = (filter: EmployeeFilter): FilterResult => {
		const validate = EmployeeFilter.safeParse(filter);

		if (!validate.success) {
			console.log(validate.error);
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${validate.error.errors[0].message}`,
			});
			return { result: "error", error: `${validate.error.errors[0].message}` };
		}

		if (filter.operation === "InList" || filter.operation === "Not_InList") {
			const list = getLabelValueList(
				validate.data.data as string[],
				initialEmployees,
				validate.data.property,
			);
			console.log("🚀 ~ addFilter ~ list:", list);
		}

		// const result = enumToLabelKeyValues(list);
		// console.log("🚀 ~ addFilter ~ filter:", filter);
		// const data = constructOperation(filter);
		// console.log("🚀 ~ addFilter ~ data:", JSON.stringify(data, null, 2));
		// console.log("🚀 ~ addFilter ~ property:", filter.property);
		// if (!data) return;
		// setFilters(prev => [...prev, filter]);
		// const employees = await GetAllEmployees();
		// const result = employees.filter(x =>
		// 	Operation(
		// 		x[filter.property.value as unknown as keyof Employee] as BasicValues,
		// 		{
		// 			valueB: data.valueB,
		// 			valueC: data.valueC,
		// 			operation: data.operation,
		// 		},
		// 	),
		// );
		// console.log("🚀 ~ addFilter ~ result:", result);
		return { result: "success" };
	};
	return (
		<div className='grid grid-rows-[auto_1fr] gap-8'>
			<div className=' mx-auto  flex  w-full max-w-md flex-row-reverse items-end justify-center gap-2'>
				<ul className='flex flex-wrap gap-2 self-start'>
					{Filters?.map((item, index) => (
						<li
							key={index}
							className='flex flex-1 items-center justify-between whitespace-nowrap rounded-md bg-muted p-1'
						>
							{/* <p className='flex-1 flex-wrap px-1 text-sm text-primary'>{`${item.property?.label}_${item.operation?.label}_${JSON.stringify(item.data)}`}</p> */}

							<Button
								variant={"ghost"}
								size={"icon"}
								// onClick={() =>
								// 	setFilters(prev =>
								// 		prev.filter(
								// 			x =>
								// 				x.operation.label !== item.operation.label &&
								// 				x.property.label !== item.property.label,
								// 		),
								// 	)
								// }
							>
								<span className='text-sm text-destructive'>X</span>
							</Button>
						</li>
					))}
				</ul>
				<FilterPopUp
					addFilter={addFilter}
					initialEmployees={initialEmployees}
				/>
			</div>
			<FilteredSimpleList initialsList={employeesList} />
		</div>
	);
}

export default FilteredEmployees;
