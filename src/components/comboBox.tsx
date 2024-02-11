"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
type Props = {
	options: {
		label: string;
		value: number;
	}[];

	selectedValue: number | undefined;
	onSelection: (selectedValue: number) => void;
};

function ComboBox({ options, selectedValue, onSelection }: Props) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{selectedValue
						? options.find(option => option.value === selectedValue)?.label ??
							"Select option..."
						: "Select option..."}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search option...' />
					<CommandEmpty>No option found.</CommandEmpty>
					<CommandGroup>
						{options.map(option => (
							<CommandItem
								key={option.value}
								value={option.value + ""}
								onSelect={currentValue => {
									onSelection(+currentValue);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										selectedValue === option.value
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default ComboBox;
