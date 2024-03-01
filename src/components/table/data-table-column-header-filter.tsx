"use server";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export async function DataTableColumnFilterHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
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
						{column.getIsSorted() === "desc" ? (
							<ArrowDown className='ml-2 h-4 w-4' />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp className='ml-2 h-4 w-4' />
						) : (
							<ArrowDownUp className='ml-2 h-4 w-4' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					{/* <DropdownMenuItem onClick={() => column.toggleSorting(false)}> */}
					<DropdownMenuItem>
						<Link
							href={{
								pathname: "/employees",
								query: { sort: "desc" },
							}}
						>
							<ArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						</Link>
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link
							href={{
								pathname: "/employees",
								query: { sort: "asc" },
							}}
						>
							<ArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						</Link>
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Hide
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<Input
						placeholder='Filter by Code...'
						value={(column.getFilterValue() || "") as string}
						onChange={event => column.setFilterValue(event.target.value)}
						className='h-8 w-[150px] lg:w-[250px]'
					/>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
