"use client";

import { UpdateEmployeeAction } from "@/app/(actions)/_EmployeesActions";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { cn } from "@/lib/utils";
import { Employee, EmployeeSchema } from "@/validation/generated-zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ComponentPropsWithoutRef, startTransition } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import EmployeeFormContent from "./employee-form-content";

export const formatErrors = (errors: Record<string, FieldError>) =>
	Object.keys(errors).map(key => ({
		key,
		message: errors[key].message,
	}));

type Props = ComponentPropsWithoutRef<"form"> & {
	employee?: Employee;
	disabled?: boolean;
};

const defaultValues: Omit<Employee, "id"> = {
	code: -1,
	hiringDate: null,
	name: "",
	salaryStatus: 0,
	positionId: -1,
};

const EmployeeForm = ({ employee, disabled, className, ...rest }: Props) => {
	const form = useForm<z.infer<typeof EmployeeSchema>>({
		resolver: zodResolver(EmployeeSchema),
		defaultValues,
	});

	const { toast } = useToast();
	const { deleteParams, pathname, searchParams, router } = useSearchUrlParams();

	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
		if (employee) {
			form.setValue("id", employee.id);
			form.setValue("code", employee.code);
			form.setValue("name", employee.name);
			form.setValue("hiringDate", employee.hiringDate);
			form.setValue("salaryStatus", employee.salaryStatus);
			form.setValue("positionId", employee.positionId);
		} else {
			form.reset();
			form.setValue("code", -1);
		}
	}, [employee, form]);

	async function onSubmit(values: z.infer<typeof EmployeeSchema>) {
		let employeeResult = undefined;
		try {
			if (employee?.id) {
				employeeResult = await UpdateEmployeeAction({
					id: employee.id,
					employee: values,
				});
			} else {
				// employeeResult = await CreateEmployee(values);
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
			if (employeeResult) {
				toast({
					variant: "success",
					title: "Success",
				});
			}
		}
	}

	if (!isClient) return null;

	return (
		<Form {...form}>
			<ScrollArea className='h-[70svh]'>
				<form
					onSubmit={form.handleSubmit(v =>
						startTransition(() => {
							onSubmit(v);
						}),
					)}
					className={cn(
						"  px-8 text-sm",
						disabled
							? "space-y-4"
							: "grid grid-cols-1 items-center gap-4 md:grid-cols-[repeat(2,minmax(100px,1fr))]",
						className,
					)}
					{...rest}
				>
					<EmployeeFormContent control={form.control} disabled={disabled} />

					<div className='text-right md:col-span-2'>
						<div className='inline-flex items-end'>
							<button
								type='submit'
								className='rounded bg-primary px-4 py-2 font-bold text-white hover:bg-primary'
							>
								{employee?.id ? "Update" : "Create"}
							</button>
						</div>
					</div>
				</form>
			</ScrollArea>
		</Form>
	);
};

export default EmployeeForm;
