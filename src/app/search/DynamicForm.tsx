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
import useFilterValuesOutput from "@/hooks/useFilterValuesOutput";
import { filterOperatorSchema } from "@/validation/filter-operator-validation";
import { FilterItem } from "@/validation/filter-validation";
import { EmployeeMandatorySchema } from "@/validation/generated-zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const REQUIRED_ERROR = "This field is required.";

const employeeSchema = FilterItem(EmployeeMandatorySchema);

const formSchema = z.object({
	employeesFilters: z.array(employeeSchema),
});

type Employee = z.infer<typeof employeeSchema>;

const defaultValues = {
	Property: "",
	Operator: {
		label: "filterOperatorSchema.enum.Or",
		value: filterOperatorSchema.enum.Or,
	},
	Value: [],
};

const useDynamicForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: {
			employeesFilters: [defaultValues],
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
	const { onSelection } = useFilterValuesOutput({});

	const { toast } = useToast();
	const [_type, setType] = useState("");

	const employeesFiltersWatch = form.watch("employeesFilters");

	const handleRemove = (index: number) => {
		if (filters.length < 2) return;
		remove(index);
	};
	const handleAdd = () => {
		if (
			!employeesFiltersWatch ||
			employeesFiltersWatch.length < 1 ||
			employeesFiltersWatch.some(
				f => !FilterItem(EmployeeMandatorySchema).safeParse(f).success,
			)
		) {
			toast({
				variant: "destructive",
				title: "Fill All Fields Before Adding New One",
			});
			return;
		}

		append(defaultValues);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='m-auto mt-10 flex  flex-col space-y-2 rounded-lg border p-6'
			>
				<div className='add mb-4 flex flex-1 gap-2 '>
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
											<FormItem className='h-20 flex-grow '>
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
												<FormMessage className='truncate text-xs ' />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`employeesFilters.${index}.Operator`}
										render={({ field }) => {
											return (
												<FormItem className='h-20 flex-grow '>
													<FormLabel>Operator</FormLabel>

													<FormControl>
														<OperatorSelection
															property={employeesFiltersWatch[index].Property}
															selectedValue={field.value.value}
															schema={EmployeeMandatorySchema}
															onSelectionChange={async value => {
																if (!value) return;
																field.onChange(value);
															}}
														/>
													</FormControl>
													<FormMessage className='truncate text-xs ' />
												</FormItem>
											);
										}}
									/>

									<FormField
										control={form.control}
										name={`employeesFilters.${index}.Value`}
										render={({ field }) => (
											<FormItem className='h-20 flex-grow'>
												<FormLabel className=''>Values</FormLabel>

												<FormControl>
													{employeesFiltersWatch[index].Operator &&
													employeesFiltersWatch[index].Property ? (
														<FilterInput
															property={employeesFiltersWatch[index]?.Property}
															Operator={
																employeesFiltersWatch[index]?.Operator.value
															}
															selectedValues={field.value}
															schema={EmployeeMandatorySchema}
															onValuesChange={async values => {
																field.onChange(values);
															}}
														/>
													) : (
														<Input disabled className='bg-muted' />
													)}
												</FormControl>
												<FormMessage className='truncate text-xs ' />
											</FormItem>
										)}
									/>
								</div>
							</div>
						))}
					</div>
					<Button size={"icon"} className='mb-2 self-end' onClick={handleAdd}>
						<Plus className='h-4 w-4' />
					</Button>
				</div>
				<Button type='submit' className='self-start'>
					Apply Filters
				</Button>
			</form>
			<pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
		</Form>
	);
};
