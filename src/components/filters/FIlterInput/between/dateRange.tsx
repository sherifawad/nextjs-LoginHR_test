import DateInput from "@/components/DateInput/DateInput";
import { useState } from "react";

type Props = {
	onValueChange: (value: Date[] | undefined) => void;
	inputValue: Date[] | undefined;
};

const defaultDate = new Date("1/1/1900");

function DateRange({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<(Date | null | undefined)[] | undefined>(
		inputValue,
	);
	const onInputChange = (data: {
		index: number;
		value: Date | null | undefined;
	}) => {
		const result = [...(value ?? [undefined, undefined])].map((v, i) => {
			if (i === data.index) {
				return data.value;
			}
			return v;
		});

		setValue(result);
		if (result.every(r => r !== undefined)) onValueChange(result as any);
	};
	return (
		<div className='flex flex-row gap-x-2 p-2'>
			<DateInput
				placeholder='From'
				SelectedDate={
					value && value.length > 0 && value[0] ? new Date(value[0]) : undefined
				}
				onDateSelected={d => {
					onInputChange({ index: 0, value: d });
				}}
			/>
			<DateInput
				placeholder='To'
				SelectedDate={
					value && value.length > 1 && value[1]
						? value[1] === defaultDate
							? undefined
							: new Date(value[1])
						: undefined
				}
				onDateSelected={d => {
					onInputChange({ index: 1, value: d });
				}}
			/>
		</div>
	);
}

export default DateRange;
