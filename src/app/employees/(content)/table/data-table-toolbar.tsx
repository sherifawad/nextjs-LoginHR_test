"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { DeleteManyEmployees } from "@/app/employees/_actions";
import { GetAllJobs } from "@/app/profile/_actions";
import { EmployeeFilter, EmployeePosition } from "@/validation/employeeSchema";
import React from "react";
import FilterPopUp from "../filterPopUp";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
	addFilter,
}: DataTableToolbarProps<TData> & {
	addFilter: (filter: EmployeeFilter) => Promise<void>;
}) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const selectedData = table.getState().rowSelection;
	const isSelected =
		Object.keys(selectedData).length !== 0 ||
		selectedData.constructor !== Object;
	const [jobs, setJobs] = React.useState<EmployeePosition[]>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const result = await GetAllJobs();
			if (result.status === "success") {
				setJobs(result.data);
			}
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
			<div className='mr-auto flex items-center gap-2'>
				<DataTableViewOptions table={table} />
				<FilterPopUp addFilter={addFilter} />
				<div />
			</div>
		</div>
	);
}
