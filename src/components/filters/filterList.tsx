"use client";

import { addNewFilter, getFilteredEmployees } from "@/app/employees/_actions";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { dataToStringWithCustomSeparator } from "@/lib/utils/filterUtils";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { useState } from "react";
import FilteredSimpleList from "../filteredList";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import FilterPopUp from "./popupFIlterForm";

export type FilterResult =
	| {
			result: "success";
	  }
	| { result: "error"; error: string };

type FilteredEmployeesProps = {
	initialEmployees: Employee[];
	initialFilters: { [key: string]: EmployeeFilter }[];
};

function FilteredEmployees({
	initialEmployees,
	initialFilters,
}: FilteredEmployeesProps) {
	// functions to manipulate searchParams
	const { deleteParams, updateParams, setParams, router } =
		useSearchUrlParams();
	// filtered employees
	const [employeesList, setEmployeesList] =
		useState<Employee[]>(initialEmployees);
	// filterList
	const [Filters, setFilters] =
		useState<{ [key: string]: EmployeeFilter }[]>(initialFilters);

	/**
	 * add new Filter
	 * @param filter employee property - comparison type - data to compate
	 * @returns result of success or error with error data
	 */
	const addFilter = async (filter: EmployeeFilter): Promise<FilterResult> => {
		const newFilter = await addNewFilter({
			filters: Filters,
			newFilter: filter,
		});
		if (!newFilter) {
			return { result: "error", error: `Internal Error` };
		}

		// validate input filter
		const validate = EmployeeFilter.safeParse(filter);

		if (!validate.success) {
			// if error set result as error and add error value
			console.log(validate.error);

			return { result: "error", error: `${validate.error.errors[0].message}` };
		}
		const newFiltersList = [...Filters, newFilter];

		updateParams([
			{
				filter: Object.keys(newFilter)[0],
			},
		]);

		setFilters(newFiltersList);
		const filteredEmployees = await getFilteredEmployees(newFiltersList);
		setEmployeesList(filteredEmployees);

		return { result: "success" };
	};

	const deleteFilter = async (item: string) => {
		//filter list

		const filteredList = Filters.filter(f =>
			Object.keys(f).find(key => key !== item),
		);
		// if list is empty remove filter key in searchParams
		if (filteredList.length === 0) {
			deleteParams(["filter"]);
		} else {
			//create filter values in searchParams
			const filterString: string[] = [];
			filteredList.forEach(fl => {
				Object.values(fl).map(v => {
					const dataAsString = dataToStringWithCustomSeparator(v.data);
					filterString.push(`${v.property}_${v.operation}_${dataAsString}`);
				});
			});

			// set Filter values in searchParams
			setParams([
				{
					filter: filterString.toString(),
				},
			]);
		}
		//set new Filter
		setFilters(filteredList);
		const filteredEmployees = await getFilteredEmployees(filteredList);
		setEmployeesList(filteredEmployees);
	};
	return (
		<div className='grid grid-rows-[auto_1fr] gap-8 py-8'>
			<div className=' mx-auto  flex w-full  max-w-xl flex-row-reverse flex-wrap items-end justify-center gap-2'>
				<ScrollArea className='max-h-[80svh]'>
					<ul className='flex flex-wrap gap-2 self-start'>
						{Filters?.map((item, index) => {
							const value = Object.keys(item)[0];
							return (
								<li key={index} className=''>
									<Button
										variant={"ghost"}
										onClick={() => deleteFilter(value)}
										className='flex flex-1 items-center justify-between gap-x-2 whitespace-nowrap rounded-md bg-muted p-1 px-3'
									>
										<p className=' flex-1 flex-wrap  text-sm text-primary'>
											{value}
										</p>
										<span className='text-base text-destructive'>X</span>
									</Button>
								</li>
							);
						})}
					</ul>
				</ScrollArea>
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
