import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
	onValueChange: (value: string) => void;
	inputValue: string | undefined;
};

function DefaultInput({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<string | number | undefined>(inputValue);
	const onInputChange = (value: string) => {
		setValue(value);
		if (value.length > 0) {
			onValueChange(value);
		}
	};
	return (
		<>
			<Input
				className='bg-muted'
				value={value}
				onChange={e => onInputChange(e.target.value)}
			/>
		</>
	);
}

export default DefaultInput;
