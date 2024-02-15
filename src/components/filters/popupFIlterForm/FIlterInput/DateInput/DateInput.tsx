"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
	onDateSelected: (range: Date) => void;
	SelectedDate: Date | undefined;
};

export default function DateInput({ onDateSelected, SelectedDate }: Props) {
	const [date, setDate] = React.useState<Date | undefined>(SelectedDate);

	const onSelection = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) onDateSelected(addDays(selectedDate, 1));
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-auto p-0'
				onInteractOutside={e => {
					e.preventDefault();
				}}
			>
				<Calendar
					mode='single'
					selected={date}
					onSelect={d => onSelection(d)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
