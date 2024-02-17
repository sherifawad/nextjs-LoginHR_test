import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableColumnFilterHeader } from "@/components/table/data-table-column-header-filter";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/validation/employeeSchema";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Employee>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
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

	// {
	// 	id: "actions",
	// 	cell: ({ row }) => {
	// 		const employee = row.original;

	// 		return <EmployeeActions employee={employee} />;
	// 	},
	// },
];
