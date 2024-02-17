"use client";

import { addNewFilter, getFilteredEmployees } from "@/app/employees/_actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { FilterOption } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { useCallback, useEffect, useState, useTransition } from "react";
import EditUserPopUpContent from "./EditUserPopUpContent";
import FilterPopUp from "./filterPopUp";
import EmployeesList from "./table";
import TableSkeleton from "./table/tableSkeletotn";

export type FilterResult =
	| {
			status: "success";
	  }
	| { status: "error"; message: string };

type FilteredEmployeesProps = {
	initialEmployees: Employee[];
	initialFilters: FilterOption[];
	employeeToEdit?: Employee;
};

function FilteredEmployees({
	initialEmployees,
	initialFilters,
	employeeToEdit,
}: FilteredEmployeesProps) {
	// functions to manipulate searchParams
	const { deleteParams, updateParams, setParams } = useSearchUrlParams();
	const [isOpenDialog, setIsOpenDialog] = useState(false);

	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	// filtered employees
	const [employeesList, setEmployeesList] =
		useState<Employee[]>(initialEmployees);
	// filterList
	const [Filters, setFilters] = useState<FilterOption[]>(initialFilters);

	/**
	 * add new Filter
	 * @param filter employee property - comparison type - data to compate
	 * @returns result of success or error with error data
	 */
	const addFilter = async (filter: EmployeeFilter) => {
		startTransition(async () => {
			const result = await addNewFilter({
				filters: Filters,
				newFilter: filter,
			});

			if (result?.status === "error") {
				toast({
					variant: "destructive",
					title: "Uh oh! Something went wrong.",
					description: result.message,
				});
				return;
			}

			updateParams([
				{
					filter: result.createdFilterValueString,
				},
			]);

			setFilters(result.updatedFilterList);

			setEmployeesList(result.employees);
		});
	};

	const deleteFilter = async (item: string) => {
		//filter list
		const filteredList = Filters.filter(f => f.label !== item);
		// if list is empty remove filter key in searchParams
		if (filteredList.length === 0) {
			deleteParams(["filter"]);
		} else {
			//create filter values in searchParams
			// set Filter values in searchParams
			setParams([
				{
					filter: filteredList.map(fl => fl.value).toString(),
				},
			]);
		}
		//set new Filter
		setFilters(filteredList);

		startTransition(async () => {
			const filteredEmployees = await getFilteredEmployees(
				filteredList.map(fl => fl.value),
			);
			setEmployeesList(filteredEmployees);
		});
	};
	useEffect(() => {
		setIsOpenDialog(prev =>
			prev === (employeeToEdit !== undefined) ? prev : !prev,
		);
	}, [employeeToEdit]);

	const onDialogClose = useCallback(
		(value: boolean) => {
			if (!value) {
				setIsOpenDialog(false);
				deleteParams(["employee"]);
			}
		},
		[deleteParams],
	);

	return (
		<Dialog open={isOpenDialog} onOpenChange={v => onDialogClose(v)}>
			<div className='grid grid-rows-[auto_1fr] gap-8 py-8'>
				{isPending ? (
					<Skeleton className='h-15 w-full' />
				) : (
					<div className=' mx-auto  flex w-full  max-w-xl flex-row-reverse flex-wrap items-end justify-center gap-2'>
						<ul className='flex flex-wrap gap-2 self-start'>
							{Filters?.map((item, index) => {
								return (
									<li key={index} className=''>
										<Button
											variant={"ghost"}
											onClick={() => deleteFilter(item.label)}
											className='flex flex-1 items-center justify-between gap-x-2 whitespace-nowrap rounded-md bg-muted p-1 px-3'
										>
											<p className=' flex-1 flex-wrap  text-sm text-primary'>
												{item.label}
											</p>
											<span className='text-base text-destructive'>X</span>
										</Button>
									</li>
								);
							})}
						</ul>
						<FilterPopUp addFilter={addFilter} />
					</div>
				)}

				{isPending ? (
					<TableSkeleton />
				) : (
					<EmployeesList employeesList={employeesList} />
				)}
			</div>
			{isOpenDialog && employeeToEdit && (
				<EditUserPopUpContent employeeToUpdate={employeeToEdit} />
			)}
		</Dialog>
	);
}

export default FilteredEmployees;
