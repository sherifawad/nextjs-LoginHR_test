"use client";

import { HeaderGroup, Row, flexRender } from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

type Props<TData, TValue> = {
	totalColumns: number;
	headers: HeaderGroup<TData>[];
	rows: Row<TData>[];
};

function DataTableBody<TData, TValue>({
	rows,
	headers,
	totalColumns,
}: Props<TData, TValue>) {
	return (
		<div className='space-y-4'>
			{/* <DataTableBodyToolbar table={table} /> */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{headers.map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{rows?.length ? (
							rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={totalColumns} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default DataTableBody;
