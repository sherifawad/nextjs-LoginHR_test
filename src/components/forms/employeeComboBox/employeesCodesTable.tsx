"use client";

import { GetAllEmployees } from "@/app/profile/_actions";
import { Employee } from "@/types";
import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";

type Props = {
	employeesList?: Employee[];
	onRowSelect: (code: number) => void;
};

function EmployeesCodesTable({ employeesList, onRowSelect }: Props) {
	const [employees, setEmployees] = useState<Employee[]>(
		employeesList ? employeesList : [],
	);
	const [filteredList, setFilteredList] = useState<Employee[]>(employees);

	const [code, setCode] = useState("");
	const [name, setName] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const result = await GetAllEmployees();

			setEmployees(result);
		};
		fetchData();
	}, []);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className=''>
						<Input
							placeholder='Code'
							className=' w-full rounded border border-none   px-4 text-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
							value={code}
							onChange={e => {
								setCode(e.target.value);
								setName("");
								setFilteredList(
									employees.filter(x =>
										x.code.toString().includes(e.target.value),
									),
								);
							}}
						/>
					</TableHead>
					<TableHead>
						<Input
							placeholder='Name'
							className=' w-full rounded border border-none   px-4 text-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
							value={name}
							onChange={e => {
								setCode("");
								setName(e.target.value);
								setFilteredList(
									employees.filter(x =>
										x.name
											.toLocaleLowerCase()
											.includes(e.target.value.toLocaleLowerCase()),
									),
								);
							}}
						/>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className=' '>
				{filteredList.length > 0 ? (
					filteredList.map(e => (
						<TableRow
							key={e.code}
							className='cursor-pointer'
							onClick={() => onRowSelect(e.code)}
						>
							<TableCell className='font-medium'>{e.code}</TableCell>
							<TableCell>{e.name}</TableCell>
						</TableRow>
					))
				) : (
					<div className='w-full p-4 text-center'>No Results.</div>
				)}
			</TableBody>
		</Table>
	);
}

export default EmployeesCodesTable;
