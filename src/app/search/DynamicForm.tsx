"use client";

import FilterInput from "@/components/filters/FIlterInput";
import PropertySelection from "@/components/filters/selections/PropertySelection";
import OperatorSelection from "@/components/filters/selections/comparisonSelections";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
	BasicOperator,
	filterOperatorSchema,
} from "@/validation/filter-operator-validation";
import { FilterItemObject } from "@/validation/filter-validation";
import { EmployeeMandatorySchema } from "@/validation/generated-zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const REQUIRED_ERROR = "This field is required.";

const employeeSchema = FilterItemObject(EmployeeMandatorySchema);

const formSchema = z.object({
	employeesFilters: z.array(employeeSchema),
});

type Employee = z.infer<typeof employeeSchema>;

const useDynamicForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: {
			employeesFilters: [
				{
					Property: "",
					Operator: filterOperatorSchema.enum.Or,
					Value: [],
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "employeesFilters",
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log(data);
	};

	return { form, onSubmit, append, remove, filters: fields };
};

export const DynamicForm = () => {
	const { form, onSubmit, filters, append, remove } = useDynamicForm();

	const { toast } = useToast();

	const employeesFiltersWatch = form.watch("employeesFilters");

	const handleRemove = (index: number) => {
		if (filters.length < 2) return;
		remove(index);
	};
	const handleAdd = () => {
		const lastIndex = employeesFiltersWatch.length - 1;
		console.log(
			"🚀 ~ handleAdd ~ employeesFiltersWatch:",
			employeesFiltersWatch,
		);

		if (
			!employeesFiltersWatch ||
			employeesFiltersWatch.length < 1 ||
			employeesFiltersWatch.some(
				f => !FilterItemObject(EmployeeMandatorySchema).safeParse(f).success,
			)
		) {
			toast({
				variant: "destructive",
				title: "Fill All Fields Before Adding New One",
			});
			return;
		}

		append({
			Property: "",
			Operator: BasicOperator.Equal,
			Value: [],
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='m-auto mt-10 flex  flex-col space-y-2 rounded-lg border p-6'
			>
				<div className='add flex flex-1 gap-2'>
					<div className='list flex flex-1 flex-col gap-2'>
						{filters.map(({ Operator, Property, Value, id }, index) => (
							<div
								key={id}
								className='remove flex flex-1 items-center justify-center gap-2'
							>
								{filters.length > 1 && (
									<Button
										variant={"destructive"}
										className='mb-2  h-6 self-end rounded-sm px-0 py-0'
										onClick={() => handleRemove(index)}
									>
										<Minus />
									</Button>
								)}
								<div className='list grid flex-1 grid-cols-[repeat(3,minmax(100px,1fr))] flex-row-reverse items-center  gap-4'>
									<FormField
										control={form.control}
										name={`employeesFilters.${index}.Property`}
										render={({ field }) => (
											<FormItem className='flex-grow'>
												<FormLabel>Property</FormLabel>
												<FormControl>
													<PropertySelection
														selectedValue={field.value}
														schema={EmployeeMandatorySchema}
														onValueChange={async value => {
															field.onChange(value);
														}}
													/>
												</FormControl>
												<FormMessage className='text-xs' />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`employeesFilters.${index}.Operator`}
										render={({ field }) => {
											return (
												<FormItem className='flex-grow'>
													<FormLabel>Operator</FormLabel>

													<FormControl>
														<OperatorSelection
															property={employeesFiltersWatch[index].Property}
															selectedValue={field.value}
															schema={EmployeeMandatorySchema}
															onValueChange={async value => {
																if (!value) return;
																field.onChange(value);
															}}
														/>
													</FormControl>
													<FormMessage className='text-xs' />
												</FormItem>
											);
										}}
									/>

									<FormField
										control={form.control}
										name={`employeesFilters.${index}.Value`}
										render={({ field }) => (
											<FormItem className='flex-grow'>
												<FormLabel className=''>Values</FormLabel>

												<FormControl>
													{employeesFiltersWatch[index].Operator &&
													employeesFiltersWatch[index].Property ? (
														<FilterInput
															property={employeesFiltersWatch[index]?.Property}
															Operator={employeesFiltersWatch[index]?.Operator}
															selectedValues={field.value?.map(v => ({
																...v,
																value: v ? v.toString() : "",
															}))}
															schema={EmployeeMandatorySchema}
															onValuesChange={async values => {
																field.onChange(values);
															}}
														/>
													) : (
														<Input disabled className='bg-muted' />
													)}
												</FormControl>
												<FormMessage className='text-xs' />
											</FormItem>
										)}
									/>
								</div>
							</div>
						))}
					</div>
					<Button size={"icon"} className='self-end' onClick={handleAdd}>
						<Plus className='h-4 w-4' />
					</Button>
				</div>
				<Button type='submit' className='self-start'>
					Apply Filters
				</Button>
			</form>
		</Form>
	);
};
