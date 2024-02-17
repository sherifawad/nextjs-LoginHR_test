"use client";

import { Row } from "@tanstack/react-table";

import { DeleteEmployee } from "@/app/profile/_actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { Employee } from "@/validation/employeeSchema";
import { MoreHorizontalIcon } from "lucide-react";
import { useCallback, useState } from "react";
import EditUserPopUpContent from "../EditUserPopUpContent";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const employee = row.original as Employee;

	const [isOpen, setIsOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const deleteEmployee = async () => {
		try {
			await DeleteEmployee(employee.code);
			window.location.reload();
		} catch (error) {
			console.log("🚀 ~ deleteEmployee ~ error:", error);
		}
	};

	const { setParams, deleteParams } = useSearchUrlParams();

	const onDialogChange = useCallback(
		(value: boolean) => {
			setIsOpen(false);
			if (value) {
				setParams([{ employee: employee.code + "" }]);
			} else {
				deleteParams(["employee"]);
				setIsDialogOpen(false);
			}
		},
		[deleteParams, employee.code, setParams],
	);

	return (
		<Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
					>
						<MoreHorizontalIcon className='h-4 w-4' />
						<span className='sr-only'>Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-[160px]'>
					{/* <DialogTrigger asChild>
						<Button size={"sm"} className=' w-full' type='button'>
							Edit
						</Button>
					</DialogTrigger> */}
					<Button
						size={"sm"}
						className=' w-full'
						type='button'
						onClick={() => setIsDialogOpen(true)}
					>
						Edit
					</Button>

					<DropdownMenuSeparator />

					<Button
						size={"sm"}
						className='w-full '
						variant={"destructive"}
						type='button'
						onClick={() => deleteEmployee()}
					>
						Delete
					</Button>
				</DropdownMenuContent>
			</DropdownMenu>
			<EditUserPopUpContent employeeToUpdate={employee} />
		</Dialog>
	);
}
