"use client";

// import FilterPopUp from "@/components/filters/popupFIlterForm";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Table } from "@tanstack/react-table";
import FilterPopUp from "../filterPopUp";

interface EmployeeTableToolbarProps<TData> {
	table: Table<TData>;
}

export function EmployeeTableToolbar<TData>({
	table,
}: EmployeeTableToolbarProps<TData> & {}) {
	return (
		<div className='flex items-center justify-between'>
			<div className='mr-auto flex items-center gap-2'>
				<DataTableViewOptions table={table} />
				<FilterPopUp />
				{/* <FilterPopUp addFilter={addFilter} /> */}
			</div>
		</div>
	);
}
