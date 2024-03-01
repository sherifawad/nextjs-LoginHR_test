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
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
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
					<Link
						href={{
							pathname: "/employees",
							query: { sort: "asc" },
						}}
					>
						<DropdownMenuItem>
							<ArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
							Asc
						</DropdownMenuItem>
					</Link>
					<Link
						href={{
							pathname: "/employees",
							query: { sort: "desc" },
						}}
					>
						<DropdownMenuItem>
							<ArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
							Desc
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
