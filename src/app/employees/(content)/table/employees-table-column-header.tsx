"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { cn } from "@/lib/utils";
import { SortingType } from "@/validation/pagination-validation";
import { startTransition, useCallback } from "react";

interface EmployeesDataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function EmployeesDataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: EmployeesDataTableColumnHeaderProps<TData, TValue>) {
	const { setParams, searchParams } = useSearchUrlParams();

	const sortBtnHandler = useCallback(
		(sortType: SortingType, columnId: string) => {
			setParams([{ sort: sortType }, { sortBy: columnId }]);
		},
		[setParams],
	);

	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='-ml-3 h-8 data-[state=open]:bg-accent'
					>
						<span>{title}</span>
						{searchParams.get("sort") === "desc" &&
						searchParams.get("sortBy") === column.id ? (
							<ArrowDown className='ml-2 h-4 w-4' />
						) : searchParams.get("sort") === "asc" &&
						  searchParams.get("sortBy") === column.id ? (
							<ArrowUp className='ml-2 h-4 w-4' />
						) : (
							<ArrowDownUp className='ml-2 h-4 w-4' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem
						className='flex w-full cursor-pointer items-center  gap-2'
						onClick={() =>
							startTransition(() => sortBtnHandler("asc", column.id))
						}
					>
						<ArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						className='flex w-full cursor-pointer items-center  gap-2'
						onClick={() =>
							startTransition(() => sortBtnHandler("desc", column.id))
						}
					>
						<ArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}
						className='w-full cursor-pointer'
					>
						<EyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
