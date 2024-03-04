import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SelectionType } from "@/types";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useState } from "react";

type Props = SelectPrimitive.SelectProps & {
	options: SelectionType[];

	selectedValue: string | undefined;
	className?: string;
	onSelection: (value: SelectionType | undefined) => void;
};

function FilterSelect({
	options = [],
	selectedValue,
	onSelection,
	className,
	...rest
}: Props) {
	const [value, setValue] = useState<string | undefined>(
		selectedValue ? selectedValue + "" : undefined,
	);
	const selectionHandler = (selection: string) => {
		const selected: SelectionType | undefined = options.find(
			x => x.value + "" === selection,
		);
		onSelection(selected);
		setValue(selected?.value + "");
	};
	return (
		<Select
			value={value}
			onValueChange={value => selectionHandler(value)}
			{...rest}
		>
			<SelectTrigger className='bg-muted capitalize'>
				<SelectValue placeholder='Select ' />
			</SelectTrigger>
			<SelectContent position='popper' className={className}>
				<ScrollArea className='h-[30svh] w-full'>
					{options.map(i => (
						<SelectItem
							className='capitalize'
							key={i.value + ""}
							value={i.value + ""}
						>
							{i.label}
						</SelectItem>
					))}
				</ScrollArea>
			</SelectContent>
		</Select>
	);
}

export default FilterSelect;
