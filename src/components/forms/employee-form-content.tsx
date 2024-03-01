import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Employee } from "@/validation/generated-zod-schemas";
import { Control } from "react-hook-form";
import DateInput from "../DateInput/DateInput";
import PositionComboBox from "../positionComboBox";
import CodeComboBox from "./employeeComboBox";
import EmployeeSelect from "./employeeSelect";

type Props = {
	control: Control<Employee, any, Employee>;
	disabled?: boolean;
};

function EmployeeFormContent({ control, disabled }: Props) {
	return (
		<>
			<FormField
				control={control}
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
				control={control}
				name='positionId'
				render={({ field }) => (
					<FormItem>
						<div className='flex w-full min-w-[300px]  flex-col gap-2'>
							<FormLabel>Employee Position</FormLabel>
							<FormControl>
								<PositionComboBox
									selectedValue={field.value}
									onSelection={v => field.onChange(v)}
								/>
							</FormControl>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name='name'
				render={({ field }) => (
					<FormItem>
						<div className='flex  flex-col items-start gap-4'>
							<FormLabel>Employee Name</FormLabel>
							<FormControl>
								<Input
									className=' h-10  rounded border bg-muted'
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
				control={control}
				name='hiringDate'
				render={({ field }) => (
					<FormItem>
						<div className='flex w-full flex-col gap-2'>
							<FormLabel>Hiring Date</FormLabel>
							<FormControl>
								<DateInput
									onDateSelected={field.onChange}
									SelectedDate={field.value}
								/>
							</FormControl>
							<FormDescription>Select Hiring Date</FormDescription>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
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
											value: "0",
										},
										{
											label: "Not Valid",
											value: "1",
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
		</>
	);
}

export default EmployeeFormContent;
