import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import Link from "next/link";

type EmployeeTableFooterProps = {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	searchParams: { [key: string]: string | string[] | undefined };
};

function EmployeeTableFooter({
	page,
	pageSize,
	totalPages,
	searchParams,
}: EmployeeTableFooterProps) {
	if (totalPages < 2) return null;
	const pageToShow = 2;

	return (
		<div className='flex items-center justify-end space-x-2 py-4'>
			<div className='flex w-full flex-1 items-center gap-x-8 text-sm	'>
				<p className='whitespace-nowrap text-sm font-medium'>Page Size</p>

				<ToggleGroup
					type='single'
					className='text-muted-foreground'
					value={pageSize + ""}
				>
					{[5, 10, 15].map(value => (
						<ToggleGroupItem
							key={value}
							value={value + ""}
							aria-label={`Toggle pageSize=${value}`}
						>
							<Link
								scroll={false}
								href={{
									query: {
										...searchParams,
										page: "1",
										pageSize: `${value}`,
									},
								}}
							>
								{value}
							</Link>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			<Pagination className='justify-end'>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							scroll={false}
							href={{
								query: {
									...searchParams,
									page: `${page < 2 ? page : page - 1}`,
								},
							}}
							className={cn(
								"transition-opacity",
								page === 1 && "pointer-events-none opacity-50",
							)}
						/>
					</PaginationItem>
					{page > pageToShow + 1 && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}
					{[...new Array(totalPages)].map((_, index) => (
						<PaginationItem
							key={index}
							className={`${index + 1 === page || (index + 1 <= page + pageToShow && index + 1 >= page - pageToShow) ? "" : "hidden"}`}
						>
							<PaginationLink
								scroll={false}
								href={{
									query: { ...searchParams, page: `${index + 1}` },
								}}
								isActive={page === index + 1}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					{page + pageToShow < totalPages && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}
					<PaginationItem>
						<PaginationNext
							scroll={false}
							href={{
								query: {
									...searchParams,
									page: `${page < 2 ? page : page - 1}`,
								},
							}}
							className={cn(
								"transition-opacity",
								page === totalPages && "pointer-events-none opacity-50",
							)}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}

export default EmployeeTableFooter;
