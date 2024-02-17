import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
	onValueChange: (value: string) => void;
};

function DefaultInput({ onValueChange }: Props) {
	const [value, setValue] = useState<string>("");
	const onInputChange = (value: string) => {
		setValue(value);
		if (value.length > 0) {
			onValueChange(value);
		}
	};
	return (
		<>
			<Input
				name='data'
				className='bg-muted'
				value={value}
				onChange={e => onInputChange(e.target.value)}
			/>
		</>
	);
}

export default DefaultInput;
