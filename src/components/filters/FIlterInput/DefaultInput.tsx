import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";

type Props = {
	onValueChange: (value?: string | null) => void;
	inputValue?: string | null;
};

function DefaultInput({ onValueChange, inputValue }: Props) {
	const [value, setValue] = useState<string | null | undefined>(inputValue);
	const onInputChange = useCallback(
		(value?: string | null) => {
			setValue(value);
			onValueChange(value);
		},
		[onValueChange],
	);
	return (
		<>
			<Input
				className='bg-muted'
				value={value ? value : ""}
				onChange={e => onInputChange(e.target.value)}
			/>
		</>
	);
}

export default DefaultInput;
