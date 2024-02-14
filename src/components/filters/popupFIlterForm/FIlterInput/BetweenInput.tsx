import { Input } from "@/components/ui/input";
import { isArrayString } from "@/lib/utils/array";
import { useState } from "react";

type Props = {
	onValueChange: (value: string[]) => void;
	inputValue: string[] | undefined;
};

function BetweenInput({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<string[] | undefined>(inputValue);
	const onInputChange = (data: { index: number; value: string }) => {
		const result = [...(value ?? ["", ""])].map((v, i) => {
			if (i === data.index) {
				return data.value;
			}
			return v;
		});
		setValue(result);
		if (isArrayString(result)) onValueChange(result);
	};
	return (
		<div className='flex flex-row gap-x-2 p-2'>
			<Input
				className='bg-muted'
				placeholder='From'
				value={value && value.length > 0 ? value[0] : ""}
				onChange={e => onInputChange({ index: 0, value: e.target.value })}
			/>
			<Input
				className='bg-muted'
				placeholder='To'
				value={value && value.length > 1 ? value[1] : ""}
				onChange={e => onInputChange({ index: 1, value: e.target.value })}
			/>
		</div>
	);
}

export default BetweenInput;
