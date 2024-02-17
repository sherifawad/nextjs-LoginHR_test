"use client";

import { Table } from "@tanstack/react-table";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	deleteSelected: (codes: number[]) => Promise<void>;
	setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
}

export function DataTableToolbar<TData>({
	table,
	deleteSelected,
	setRowSelection,
}: DataTableToolbarProps<TData>) {
	const selectedData = table.getState().rowSelection;
	const isSelected =
		Object.keys(selectedData).length !== 0 ||
		selectedData.constructor !== Object;

	const onDelete = async () => {
		const codes = Object.keys(selectedData).map(k => +k);
		deleteSelected(codes);
		setRowSelection({});
	};

	return (
		<div className='flex min-h-10 items-center justify-between'>
			{isSelected && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant={"destructive"} className='inline-flex self-start'>
							Delete {Object.keys(selectedData).length}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete these
								accounts and remove them from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => onDelete()}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
