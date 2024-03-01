import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
	onValueChange: (value: number[] | undefined) => void;
	inputValue: number[] | undefined;
};

function NumberRange({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<number[] | undefined>(inputValue);
	const onInputChange = (data: { index: number; value: number }) => {
		const result = [...(value ?? [0, 0])].map((v, i) => {
			if (i === data.index) {
				return data.value;
			}
			return v;
		});
		if (result[0] > result[1]) return;
		setValue(result);

		onValueChange(result);
	};
	return (
		<div className='flex flex-row gap-x-2 p-2'>
			<Input
				className='bg-muted'
				placeholder='From'
				value={value && value.length > 0 ? (!value[0] ? 0 : value[0]) : 0}
				onChange={e => {
					if (isNaN(Number(e.target.value))) {
						return;
					}
					onInputChange({ index: 0, value: +e.target.value });
				}}
			/>
			<Input
				className='bg-muted'
				placeholder='To'
				value={value && value.length > 1 ? (!value[1] ? 0 : value[1]) : 0}
				onChange={e => {
					if (isNaN(Number(e.target.value))) {
						return;
					}
					onInputChange({ index: 1, value: +e.target.value });
				}}
			/>
		</div>
	);
}

export default NumberRange;
