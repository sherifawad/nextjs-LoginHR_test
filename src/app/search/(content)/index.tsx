"use client";

import { DeleteManyEmployees } from "@/app/employees/_actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkFilterMatch } from "@/lib/utils/filterUtils";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getFilteredEmployees } from "../_actions";
import FilterForm from "./form";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

type Props = {};

function SearchContent({}: Props) {
	const [isOpenDialog, setIsOpenDialog] = useState(false);

	const [filters, setFilters] = useState<EmployeeFilter[]>([]);

	const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
	const dialogButtonRef = useRef<HTMLButtonElement>(null);
	const [filtersComponent, setFiltersComponent] = useState<number[]>([1]);
	const formRefs = useRef<HTMLFormElement[]>([]);
	const [isFiltersSet, setIsFiltersSet] = useState(false);

	const submitHandler = async (filter: EmployeeFilter) => {
		setFilters(prev => {
			const matchExist = prev.some(p => checkFilterMatch(p, filter));
			if (matchExist) return prev;
			return [...prev, filter];
		});
	};

	const applyFilter = async () => {
		formRefs.current.forEach(f => {
			f.requestSubmit();
		});
		setIsFiltersSet(true);
	};

	const deleteComponent = (item: number) => {
		setFiltersComponent(prev => {
			if (prev && prev.length > 1) {
				return prev.filter((x, i) => x !== item);
			}
			return prev;
		});
	};

	const data = useCallback(async () => {
		const { filteredEmployees } = await getFilteredEmployees({ filters });
		setFilteredEmployees(filteredEmployees);
		setIsOpenDialog(true);
	}, [filters]);

	const onDialogClose = useCallback((value: boolean) => {
		if (!value) {
			setIsOpenDialog(false);
			setFilters([]);
		}
	}, []);

	const deleteSelected = useCallback(
		async (codes: number[]) => {
			const results = await DeleteManyEmployees(codes);
			if (results.length > 0) {
				data();
			}
		},
		[data],
	);

	useEffect(() => {
		if (isFiltersSet) {
			data();
			setIsFiltersSet(false);
		}
	}, [data, filters, isFiltersSet]);

	return (
		<Dialog open={isOpenDialog} onOpenChange={v => onDialogClose(v)}>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-wrap gap-2'>
					<div className='flex flex-1 flex-col gap-2'>
						{filtersComponent.map((item, i) => (
							<div className='flex gap-2' key={item}>
								{filtersComponent.length > 1 && (
									<Button
										variant={"destructive"}
										className='h-6  self-end rounded-sm px-0 py-0'
										onClick={() => deleteComponent(item)}
									>
										<Minus />
									</Button>
								)}
								<FilterForm
									submitHandler={submitHandler}
									ref={el => {
										if (el) {
											return (formRefs.current[i] = el);
										}
									}}
									className='flex-1'
								/>
							</div>
						))}
					</div>
					<Button
						size={"icon"}
						className='self-end'
						onClick={() => {
							setFiltersComponent(prev => [...prev, prev.length + 1]);
						}}
					>
						<Plus className='h-4 w-4' />
					</Button>
				</div>
				<Button className='self-start' onClick={() => applyFilter()}>
					Apply
				</Button>
			</div>
			<DialogContent
				onInteractOutside={e => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Filtered List</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[60svh]'>
					<DataTable
						columns={columns}
						data={filteredEmployees}
						deleteSelected={deleteSelected}
					/>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

export default SearchContent;
