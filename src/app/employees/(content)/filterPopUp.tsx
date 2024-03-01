"use client";
import FilterFormContent from "@/components/filters/FilterFormContent";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { FilterItemObject } from "@/validation/filter-validation";
import {
	Employee,
	EmployeeMandatorySchema,
	EmployeeSchema,
} from "@/validation/generated-zod-schemas";
import { Filter } from "lucide-react";
import { FormEvent, useCallback, useContext, useState } from "react";
import { EmployeeContext } from "../employeeContext";

type Props = {
	onSubmit: (filter: FilterItemObject<Employee>) => Promise<void>;
	onCancel: () => Promise<void>;
	className?: string;
};
function FilterForm({ onSubmit: submitHandler, onCancel }: Props) {
	const [selectionData, setSelectionData] = useState<
		Partial<FilterItemObject<Employee>>
	>({
		Property: undefined,
		Operator: undefined,
		Value: undefined,
	});

	const { toast } = useToast();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validate = FilterItemObject(EmployeeSchema).safeParse(selectionData);
		if (!validate.success) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${validate.error.errors[0].message}`,
				// description: "Fill All Filter Data",
			});

			return;
		}
		toast({
			variant: "success",
			title: "Success",
			// description: "Fill All Filter Data",
		});
		submitHandler(validate.data);
	};
	return (
		<form onSubmit={onSubmit} className='flex flex-wrap gap-4 md:flex-col'>
			<FilterFormContent
				schema={EmployeeMandatorySchema}
				selectionData={selectionData}
				setSelectionData={setSelectionData}
				className='grid-cols-1 grid-rows-3 '
			/>
			<div className='flex justify-between gap-x-4 self-end'>
				<Button type='button' onClick={() => onCancel()} variant='outline'>
					Cancel
				</Button>
				<Button type='submit'>Apply</Button>
			</div>
		</form>
	);
}

function FilterPopUp() {
	const { addEmployeesFilter } = useContext(EmployeeContext) as EmployeeContext;

	const [isOpen, setIsOpen] = useState(false);
	const onSubmit = useCallback(
		async (filter: FilterItemObject<Employee>) => {
			addEmployeesFilter(filter);
			setIsOpen(false);
		},
		[addEmployeesFilter],
	);
	const onCancel = useCallback(async () => {
		setIsOpen(false);
	}, []);
	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant={"secondary"} className='h-8'>
					<Filter className='h-3 w-3' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className=' p-0'
				onInteractOutside={e => e.preventDefault()}
			>
				<Card className='w-[350px]'>
					<CardHeader>
						<CardDescription>Choose Desired Filters</CardDescription>
					</CardHeader>
					<CardContent>
						<FilterForm onCancel={onCancel} onSubmit={onSubmit} />
					</CardContent>
				</Card>
			</PopoverContent>
		</Popover>
	);
}

export default FilterPopUp;
