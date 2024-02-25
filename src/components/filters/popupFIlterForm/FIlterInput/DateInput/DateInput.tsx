"use client";

import { format } from "date-fns";
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
	onDateSelected: (dateStringInSeconds: string) => void;
};

export default function DateInput({ onDateSelected }: Props) {
	const [date, setDate] = React.useState<Date | undefined>(undefined);

	const onSelection = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) {
			// const date = addDays(selectedDate, 1).getTime().toString();
			const dateStringInSeconds = selectedDate.getTime().toString();
			onDateSelected(dateStringInSeconds);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full  justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, "PP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className=' p-0'
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
