"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CommandShortcut } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { JobCode } from "@/data";
import { employeesRepo } from "@/database/employees-repo";
import { useKeyPress } from "@/hooks/useKeyPress";
import { Employee, SalaryStatus } from "@/types";
import ComboBox from "./comboBox";
import DatePicker from "./datePicker";
import EmployeeCodeSearch from "./employee-code-button";

const defaultVales: Employee = {
	code: -1,
	hiringDate: new Date(),
	name: "",
	salaryStatus: "valid",
	jobCode: undefined,
};

type Props = {
	employee?: Employee;
};

export default function CardWithForm({ employee }: Props) {
	const { getAll, create, getByCode, update } = employeesRepo;
	const employees = React.useMemo(() => getAll(), [getAll]);
	const [data, setData] = React.useState<Employee>(
		employee ? employee : defaultVales,
	);
	const [editMode, setEditMode] = React.useState<boolean>(false);

	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
	}, []);

	useKeyPress(() => {
		const employeesByHighestCode = employees.sort((a, b) => b.code! - a.code!);
		setData({ ...defaultVales, code: employeesByHighestCode[0].code! + 1 });
	}, ["F8"]);

	const onEditEmployee = async (code: number) => {
		const employee = getByCode(code);
		if (!employee) return;
		setData(employee);
		setEditMode(true);
	};

	const onDateSelect = (dateValue: Date | undefined) =>
		setData(prev => ({ ...prev, hiringDate: dateValue }));
	const onJobCodeSelect = (code: number) => {
		if (!isNaN(code)) setData(prev => ({ ...prev, jobCode: code }));
	};

	const onSubmitHandler: React.FormEventHandler = async e => {
		e.preventDefault();
		try {
			if (!data.code || !data.name || data.name.length < 1) return;
			if (editMode) {
				const { code } = data;
				update(code, data);
			} else {
				const notValidEmployerCode =
					employees.some(e => e.code === data.code) || data.code < 0;
				if (notValidEmployerCode) return;
				create(data);
			}
		} catch (error) {
			console.log("🚀 ~ CardWithForm ~ error:", error);
		} finally {
			setData(() => defaultVales);
			setEditMode(false);
		}
	};

	if (!isClient) return null;

	return (
		<Card className='mx-auto w-[350px]'>
			<CardHeader>
				<CardTitle className='capitalize'>employee files Entry</CardTitle>
				<CardDescription>
					<div className='flex items-center justify-between'>
						<div>Deploy your new Employee Data.</div>
						<EmployeeCodeSearch editEmployee={onEditEmployee} />
					</div>
				</CardDescription>
			</CardHeader>
			<form onSubmit={onSubmitHandler}>
				<CardContent>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='code'>Employee code</Label>
							<div className='flex items-center justify-between space-x-2'>
								<Input
									id='code'
									placeholder='Code of the Employee'
									value={data.code === -1 ? "" : data.code}
									onChange={e =>
										setData(prev => ({ ...prev, code: +e.target.value }))
									}
									type='number'
									required
									disabled={editMode}
								/>
								<CommandShortcut>⌘F8</CommandShortcut>
							</div>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Employee name</Label>
							<Input
								id='name'
								placeholder='Name of the Employee'
								value={data.name}
								onChange={e =>
									setData(prev => ({ ...prev, name: e.target.value }))
								}
								required
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='status'>Salary status</Label>
							<Select
								defaultValue={data.salaryStatus}
								onValueChange={value =>
									setData(prev => ({
										...prev,
										salaryStatus: value as SalaryStatus,
									}))
								}
							>
								<SelectTrigger id='status'>
									<SelectValue placeholder='Select' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='valid'>Valid</SelectItem>
									<SelectItem value='not-valid'>Not Valid</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='jobCode'>Job</Label>

							<ComboBox
								options={JobCode}
								selectedValue={data.jobCode}
								onSelection={onJobCodeSelect}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='hire-date'>Date of Hiring</Label>
							<DatePicker date={data.hiringDate} onDateSelect={onDateSelect} />
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-between'>
					<Button
						type='button'
						variant='outline'
						onClick={() => {
							setEditMode(false);
							setData(defaultVales);
						}}
					>
						Cancel
					</Button>
					<Button type='submit'>{editMode ? "Edit" : "Create"}</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
