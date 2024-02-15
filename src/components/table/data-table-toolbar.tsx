"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DeleteManyEmployees } from "@/app/employees/_actions";
import { GetAllJobs } from "@/app/profile/_actions";
import { iterate } from "@/lib/utils/array";
import {
	EmployeePosition,
	SalaryStatusEnum,
} from "@/validation/employeeSchema";
import React from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const selectedData = table.getState().rowSelection;
	const isSelected =
		Object.keys(selectedData).length !== 0 ||
		selectedData.constructor !== Object;
	const [jobs, setJobs] = React.useState<EmployeePosition[]>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const result = await GetAllJobs();

			setJobs(result);
		};
		fetchData();
	}, []);

	const deleteSelected = async () => {
		const results = await DeleteManyEmployees(
			Object.keys(selectedData).map(k => +k),
		);
	};

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-col space-y-2'>
				<div className='flex flex-1 flex-wrap items-center space-x-2'>
					<Input
						placeholder='Filter by Name...'
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={event =>
							table.getColumn("name")?.setFilterValue(event.target.value)
						}
						className='h-8 w-[150px] lg:w-[250px]'
					/>
					{table.getColumn("salaryStatus") && (
						<DataTableFacetedFilter
							column={table.getColumn("salaryStatus")}
							title='salaryStatus'
							options={iterate(SalaryStatusEnum.Enum) as any}
						/>
					)}
					{table.getColumn("position") && (
						<DataTableFacetedFilter
							column={table.getColumn("position")}
							title='JobCode'
							options={jobs.map(j => ({
								label: j.positionName,
								value: j.positionCode + "",
							}))}
						/>
					)}
					{isFiltered && (
						<Button
							variant='ghost'
							onClick={() => table.resetColumnFilters()}
							className='h-8 px-2 lg:px-3'
						>
							Reset
							<Cross2Icon className='ml-2 h-4 w-4' />
						</Button>
					)}
				</div>
				{isSelected && (
					<Button
						onClick={() => deleteSelected()}
						variant={"destructive"}
						className='inline-flex self-start'
					>
						Delete {Object.keys(selectedData).length}
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
