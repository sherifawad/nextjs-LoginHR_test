"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import DataTableBody from "@/components/table/table-body";
import EmployeeTableFooter from "./employee-table-footer";
import { EmployeeTableToolbar } from "./employees-table-toolbar";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	searchParams: { [key: string]: string | string[] | undefined };
}

export function EmployeesDataTable<TData, TValue>({
	columns,
	data,
	page,
	pageSize,
	totalCount,
	totalPages,
	searchParams,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		enableRowSelection: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	const headers = table.getHeaderGroups();
	const rows = table.getRowModel().rows;
	const totalColumns = columns.length;

	// const initialRender = useRef(true);

	// useEffect(() => {
	// 	if (initialRender.current) {
	// 		initialRender.current = false;
	// 		return;
	// 	}
	// 	setTotalColumns(columns.length);
	// }, [columns.length, totalColumns]);

	return (
		<div className='space-y-4 py-8'>
			<EmployeeTableToolbar table={table}  />
			<DataTableBody
				totalColumns={totalColumns}
				headers={headers}
				rows={rows}
			/>
			<EmployeeTableFooter
				page={page}
				pageSize={pageSize}
				totalCount={totalCount}
				totalPages={totalPages}
				searchParams={searchParams}
			/>
		</div>
	);
}
