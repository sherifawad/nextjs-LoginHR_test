import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableColumnFilterHeader } from "@/components/table/data-table-column-header-filter";
import { getEnumName } from "@/lib/utils/array";
import {
	Employee,
	EmployeePosition,
	SalaryStatusEnum,
} from "@/validation/employeeSchema";
import { ColumnDef } from "@tanstack/react-table";
import { Timer } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Employee>[] = [
	{
		accessorKey: "code",
		header: ({ column }) => (
			<DataTableColumnFilterHeader column={column} title='Code' />
		),
		cell: ({ row }) => (
			<div className='w-[50px] text-center'>{row.getValue("code")}</div>
		),
		// enableSorting: false,
		enableHiding: false,
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => <div className=''>{row.getValue("name")}</div>,
		// enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "salaryStatus",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Salary Status' />
		),
		cell: ({ row }) => {
			const value = getEnumName(
				row.getValue("salaryStatus"),
				SalaryStatusEnum.enum,
			);
			return <div className='w-[70px] text-center'>{value}</div>;
		},
		// enableSorting: false,
		// enableHiding: false,
		filterFn: (row, id, value) => {
			if (id === "salaryStatus") {
				const original = row.original as Employee;
				return value.includes(original.salaryStatus);
			}
		},
	},
	{
		accessorKey: "position",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Job Code' />
		),
		cell: ({ row }) => {
			if (row.getValue("position")) {
				const position = row.getValue("position") as EmployeePosition;
				return (
					<div className='w-[70px] text-center'>{position.positionName}</div>
				);
			}
			return <div className='w-[70px] text-center'>-</div>;
		},
		filterFn: (row, id, value) => {
			if (id === "position") {
				const original = row.original as Employee;
				if (original.position) {
					return value.includes(original.position.positionCode + "");
				}
			}
		},
		// enableSorting: false,
		// enableHiding: false,
	},

	{
		accessorKey: "hiringDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='hiringDate' />
		),
		cell: ({ row }) => {
			const rowDate = new Date(row.getValue("hiringDate"));
			if (!rowDate) {
				return null;
			}
			const placeTime = new Intl.DateTimeFormat("en-GB").format(rowDate);
			return (
				<div className='flex w-[100px] items-center'>
					<Timer className='mr-2 h-4 w-4 text-muted-foreground' />
					<time suppressHydrationWarning>{placeTime}</time>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "actions",
		cell: ({ row, table: {} }) => <DataTableRowActions row={row} />,
	},
];
