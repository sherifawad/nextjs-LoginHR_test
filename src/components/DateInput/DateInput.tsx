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
	onDateSelected: (date?: Date | null) => void;
	SelectedDate?: Date | null;
	placeholder?: string;
};

export default function DateInput({
	onDateSelected,
	SelectedDate,
	placeholder,
}: Props) {
	const [date, setDate] = React.useState<Date | null | undefined>(SelectedDate);

	const onSelection = (selectedDate?: Date | null) => {
		setDate(selectedDate);
		onDateSelected(selectedDate);
	};

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn("w-full justify-start bg-muted text-left font-normal")}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? (
						format(date, "dd/MM/yyyy")
					) : placeholder ? (
						<span>{<span>Pick a date</span>}</span>
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={date ?? undefined}
					onSelect={d => onSelection(d)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
