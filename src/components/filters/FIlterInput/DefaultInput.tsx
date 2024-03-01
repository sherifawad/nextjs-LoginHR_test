import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
	onValueChange: (value: string | number | undefined) => void;
	inputValue: string | number | undefined;
};

function DefaultInput({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<string | number | undefined>("");
	const onInputChange = (value: string) => {
		setValue(value);
		onValueChange(value);
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
