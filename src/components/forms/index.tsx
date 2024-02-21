"use client";

import {
	CreateEmployee,
	DeleteEmployee,
	UpdateEmployee,
} from "@/app/profile/_actions";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { cn } from "@/lib/utils";
import { Employee, SalaryStatusEnum } from "@/validation/employeeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { ComponentPropsWithoutRef, useTransition } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
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

type Props = ComponentPropsWithoutRef<"form"> & {
	employee?: Employee;
	editMode?: boolean;
	disabled?: boolean;
};

const defaultValues = {
	code: -1,
	hiringDate: new Date(),
	name: "",
	positionCode: null,
	position: null,
	salaryStatus: SalaryStatusEnum.enum.VALID,
};

const EmployeeForm = ({
	employee,
	editMode,
	disabled,
	className,
	...rest
}: Props) => {
	const form = useForm<z.infer<typeof Employee>>({
		resolver: zodResolver(Employee),
		defaultValues,
	});

	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const { deleteParams, router } = useSearchUrlParams();

	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
		if (employee) {
			form.setValue("code", employee.code);
			form.setValue("name", employee.name);
			form.setValue("hiringDate", employee.hiringDate);

			form.setValue("salaryStatus", employee.salaryStatus);
			form.setValue("positionCode", employee.positionCode);
			if (employee.position) {
				form.setValue("position", employee.position);
			}
		} else {
			form.reset();
			form.setValue("code", -1);
		}
	}, [employee, form]);

	async function onSubmit(values: z.infer<typeof Employee>) {
		let initialEmployee = undefined;
		try {
			if (editMode && employee) {
				initialEmployee = await UpdateEmployee(employee.code, values);
			} else {
				initialEmployee = await CreateEmployee(values);
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
		}
		if (initialEmployee) {
			toast({
				variant: "success",
				title: "Success",
			});
			deleteParams(["employee"]);
			// router.refresh();
			startTransition(() => {
				window.location.reload();
			});
		}
	}

	const deleteEmployee = async (code: number) => {
		try {
			const deleted = await DeleteEmployee(code);
			if (deleted) {
				toast({
					variant: "success",
					title: "Success",
				});
				deleteParams(["employee"]);
				form.reset();
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: error instanceof Error ? error.message : `${error}`,
			});
		}
	};

	if (!isClient) return null;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					"  px-8 text-sm",
					disabled
						? "space-y-4"
						: "grid grid-cols-1 items-center gap-4 md:grid-cols-[repeat(2,minmax(100px,1fr))]",
					className,
				)}
				{...rest}
			>
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<div className='flex w-full flex-col gap-2 '>
								<FormLabel>Employee Code</FormLabel>
								<FormControl>
									<CodeComboBox
										selectedValue={field.value}
										onSelection={v => field.onChange(v)}
										disabled={disabled}
									/>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='positionCode'
					render={({ field }) => (
						<FormItem>
							<div className='flex w-full min-w-[300px]  flex-col gap-2'>
								<FormLabel>Employee Position</FormLabel>
								<FormControl>
									<ComboBox
										selectedValue={field.value}
										onSelection={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<div className='flex w-full flex-col gap-2'>
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
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='hiringDate'
					render={({ field }) => (
						<FormItem>
							<div className='flex w-full flex-col gap-2'>
								<FormLabel>Hiring Date</FormLabel>
								<FormControl>
									<DatePicker
										onDateSelect={field.onChange}
										date={field.value}
									/>
								</FormControl>
								<FormDescription>Select Hiring Date</FormDescription>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='salaryStatus'
					render={({ field }) => (
						<FormItem>
							<div className='flex w-full flex-col gap-2'>
								<FormLabel>Salary Status</FormLabel>
								<FormControl>
									<EmployeeSelect
										onSelection={e => (e ? field.onChange(+e) : {})}
										selectedValue={field.value + ""}
										items={[
											{
												label: "Valid",
												value: SalaryStatusEnum.enum.VALID + "",
											},
											{
												label: "Not Valid",
												value: SalaryStatusEnum.enum.NOT_VALID + "",
											},
										]}
									/>
								</FormControl>
								<FormDescription>Select Salary Status</FormDescription>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<div className='flex text-right md:col-span-2'>
					<div className=' inline-flex gap-4 self-start'>
						<Button type='submit'>
							{form.formState.isSubmitting ? (
								<Loader className='animate-spin' />
							) : (
								<>{editMode && employee ? "Update" : "Create"}</>
							)}
						</Button>
						{editMode && employee && (
							<Button
								type='button'
								variant={"destructive"}
								onClick={async () => {
									await deleteEmployee(form.getValues("code"));
								}}
							>
								{form.formState.isSubmitting ? (
									<Loader className='animate-spin' />
								) : (
									<>Delete</>
								)}
							</Button>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
};

export default EmployeeForm;
