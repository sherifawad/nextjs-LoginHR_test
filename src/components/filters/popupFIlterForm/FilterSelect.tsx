import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BasicValues, FilterOption } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useState } from "react";

type Props = SelectPrimitive.SelectProps & {
	options: FilterOption[];

	selectedValue: BasicValues | undefined;
	onSelection: (value: FilterOption | undefined) => void;
};

function FilterSelect({
	options = [],
	selectedValue,
	onSelection,
	...rest
}: Props) {
	const [value, setValue] = useState<string | undefined>(
		selectedValue ? selectedValue + "" : undefined,
	);
	const selectionHandler = (selection: string) => {
		const selected: FilterOption | undefined = options.find(
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
			<SelectTrigger className='bg-muted'>
				<SelectValue placeholder='Select ' />
			</SelectTrigger>
			<SelectContent position='popper'>
				<ScrollArea className='max-h-60'>
					{options.map(i => (
						<SelectItem key={i.value + ""} value={i.value + ""}>
							{i.label}
						</SelectItem>
					))}
				</ScrollArea>
			</SelectContent>
		</Select>
	);
}

export default FilterSelect;
