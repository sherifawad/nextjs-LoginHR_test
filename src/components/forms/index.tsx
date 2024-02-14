"use client";

import { CreateEmployee, UpdateEmployee } from "@/app/profile/_actions";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { Employee, SalaryStatusEnum } from "@/validation/employeeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import ComboBox from "./comboBox";
import DatePicker from "./datePicker";
import CodeComboBox from "./employeeComboBox";
import EmployeeSelect from "./employeeSelect";

export const formatErrors = (errors: Record<string, FieldError>) =>
	Object.keys(errors).map(key => ({
		key,
		message: errors[key].message,
	}));

type Props = {
	employee?: Employee;
	editMode?: boolean;
};

const defaultValues = {
	code: -1,
	hiringDate: new Date(),
	name: "",
	position: {
		positionCode: -1,
		positionName: "",
	},
	salaryStatus: SalaryStatusEnum.Values.VALID,
};

const EmployeeForm = ({ employee, editMode }: Props) => {
	const form = useForm<z.infer<typeof Employee>>({
		resolver: zodResolver(Employee),
		defaultValues,
	});

	const { toast } = useToast();
	const { deleteParams } = useSearchUrlParams();

	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
		if (employee) {
			form.setValue("code", employee.code);
			form.setValue("name", employee.name);
			form.setValue("hiringDate", employee.hiringDate);
			form.setValue("position", employee.position);
			form.setValue("salaryStatus", employee.salaryStatus);
		} else {
			form.reset();
			form.setValue("code", -1);
		}
	}, [employee, form]);

	async function onSubmit(values: z.infer<typeof Employee>) {
		try {
			let employee = undefined;
			if (editMode) {
				const { code } = values;
				employee = await UpdateEmployee(code, values);
			} else {
				employee = await CreateEmployee(values);
			}
		} catch (error) {
			let errorMessage = error;
			if (error instanceof Error) {
				error = error.message;
			}
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: `${errorMessage}`,
			});
		} finally {
			if (employee) {
				toast({
					variant: "success",
					title: "Success",
				});
				deleteParams(["employee"]);
			}
		}
	}

	if (!isClient) return null;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid  grid-cols-1 gap-4 gap-x-2 px-8 text-sm md:grid-cols-2'
			>
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Employee Code</FormLabel>
							<FormControl>
								<CodeComboBox
									selectedValue={field.value}
									onSelection={code =>
										code ? form.setValue("code", code) : undefined
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='position'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Employee Code</FormLabel>
							<FormControl>
								<ComboBox
									selectedValue={field.value}
									onSelection={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Employee Name</FormLabel>
							<FormControl>
								<Input
									className='mt-1 h-10 w-full rounded border bg-muted px-4'
									placeholder='Name'
									{...field}
								/>
							</FormControl>
							<FormDescription>Select Employee Name</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='hiringDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hiring Date</FormLabel>
							<FormControl>
								<DatePicker onDateSelect={field.onChange} date={field.value} />
							</FormControl>
							<FormDescription>Select Hiring Date</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='salaryStatus'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Salary Status</FormLabel>
							<FormControl>
								<EmployeeSelect
									onSelection={field.onChange}
									selectedValue={field.value}
									items={[
										{
											label: "Valid",
											value: SalaryStatusEnum.Values.VALID,
										},
										{
											label: "Not Valid",
											value: SalaryStatusEnum.Values.NOT_VALID,
										},
									]}
								/>
							</FormControl>
							<FormDescription>Select Salary Status</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='text-right md:col-span-2'>
					<div className='inline-flex items-end'>
						<button
							type='submit'
							className='rounded bg-primary px-4 py-2 font-bold text-white hover:bg-primary'
						>
							{editMode ? "Update" : "Create"}
						</button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default EmployeeForm;
