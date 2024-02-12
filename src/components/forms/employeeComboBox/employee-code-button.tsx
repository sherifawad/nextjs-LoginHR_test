"use client";

import { DeleteEmployee, GetEmployees } from "@/app/profile/_actions";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/types";
import { FormEvent, useState } from "react";
import PopUpDialogue from "../../popup-dialogue";

const CodeSearchTrigger = () => {
	return <Button>Search</Button>;
};

type Props = {
	editEmployee: (code: number) => void;
};

function EmployeeCodeSearch({ editEmployee }: Props) {
	const [employeeCodeSearch, setEmployeeCodeSearch] = useState<
		number | undefined
	>();
	const [list, setList] = useState<Employee[]>([]);

	const onDelete = async (code: number) => {
		DeleteEmployee(code);
		const filteredList = list.filter(e => e.code !== code);
		if (filteredList.length < 1) {
			setEmployeeCodeSearch(undefined);
		}
		setList(filteredList);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!employeeCodeSearch) return;
		const filteredList = await GetEmployees(x => x.code === employeeCodeSearch);
		setList(filteredList);
	};

	return (
		<PopUpDialogue
			title='Find Employee Using Code'
			triggerComponent={CodeSearchTrigger}
		>
			<div className='flex flex-col space-y-4'>
				<form onSubmit={handleSubmit}>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='code'>Employee code</Label>
						<div className='flex items-center justify-between space-x-2'>
							<Input
								id='code'
								name='code'
								placeholder='Code of the Employee'
								type='number'
								value={employeeCodeSearch || ""}
								onChange={e => setEmployeeCodeSearch(+e.target.value)}
								required
							/>
							<Button type='submit'>S</Button>
						</div>
					</div>
				</form>
				<ul>
					{list.length < 1 && <div className='text-center'>No Results.</div>}
					<Separator className='my-4' />
					{list.map(e => (
						<li key={e.code}>
							<div className='grid grid-cols-[1fr_4fr_auto] items-center px-4'>
								<div>{e.code}</div>
								<div>{e.name}</div>
								<div className='flex items-center justify-between gap-x-3'>
									<DialogClose
										className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
										onClick={() => {
											editEmployee(e.code!);
											setEmployeeCodeSearch(undefined);
											setList([]);
										}}
									>
										Edit
									</DialogClose>
									<Button
										type='button'
										size={"sm"}
										variant={"destructive"}
										onClick={() => onDelete(e.code!)}
									>
										Delete
									</Button>
								</div>
							</div>
							<Separator className='my-4' />
						</li>
					))}
				</ul>
			</div>
		</PopUpDialogue>
	);
}

export default EmployeeCodeSearch;
