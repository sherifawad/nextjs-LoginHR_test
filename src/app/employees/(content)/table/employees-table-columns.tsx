import { Employee } from "@/validation/generated-zod-schemas";
import { ColumnDef } from "@tanstack/react-table";
import { Timer } from "lucide-react";
import EmployeesActions from "./employees-table-action-column";
import { EmployeesDataTableColumnHeader } from "./employees-table-column-header";

export const employeesColumns = ({
	onDelete,
}: {
	onDelete: (id: number) => Promise<void>;
}): ColumnDef<Employee>[] => [
	{
		accessorKey: "code",
		header: ({ column }) => (
			<EmployeesDataTableColumnHeader column={column} title='Code' />
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
			<EmployeesDataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => <div className=''>{row.getValue("name")}</div>,
		// enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "salaryStatus",
		header: ({ column }) => (
			<EmployeesDataTableColumnHeader column={column} title='Salary Status' />
		),
		cell: ({ row }) => {
			const value = row.getValue("salaryStatus");
			return (
				<div className='w-[70px] text-center'>
					{row.getValue("salaryStatus")}
				</div>
			);
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
	// {
	// 	accessorKey: "position",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title='Job Code' />
	// 	),
	// 	cell: ({ row }) => {
	// 		const position = row.getValue("position") as EmployeePosition;
	// 		return (
	// 			<div className='w-[70px] text-center'>{position.positionName}</div>
	// 		);
	// 	},
	// 	filterFn: (row, id, value) => {
	// 		if (id === "position") {
	// 			const original = row.original as Employee;

	// 			return value.includes(original.position.positionCode + "");
	// 		}
	// 	},
	// 	// enableSorting: false,
	// 	// enableHiding: false,
	// },

	{
		accessorKey: "hiringDate",
		header: ({ column }) => (
			<EmployeesDataTableColumnHeader column={column} title='hiringDate' />
		),
		cell: ({ row }) => {
			const rowDate = row.getValue("hiringDate");
			if (!rowDate || rowDate == null) {
				return <div className='flex w-[100px]  justify-center'>-</div>;
			}
			const placeTime = new Intl.DateTimeFormat("en-GB").format(
				new Date(row.getValue("hiringDate")),
			);
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
		cell: ({ row, table: {} }) => (
			<EmployeesActions row={row} onDelete={onDelete} />
		),
	},
];
