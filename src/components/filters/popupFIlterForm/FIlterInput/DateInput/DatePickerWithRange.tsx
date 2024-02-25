"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	onRangeDateInSecondStringSelected: (range: string[]) => void;
};

export default function DatePickerWithRange({
	onRangeDateInSecondStringSelected,
	className,
}: Props) {
	const [date, setDate] = React.useState<DateRange | undefined>(undefined);

	const onSelection = (range: DateRange | undefined) => {
		setDate(range);
		if (range && range.from && range.to)
			// onRangeDateSelected([addDays(range.from, 1), addDays(range.to, 1)]);
			onRangeDateInSecondStringSelected([
				range.from.getTime().toString(),
				range.to.getTime().toString(),
			]);
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "PP")} - {format(date.to, "PP")}
								</>
							) : (
								format(date.from, "PP")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto p-0'
					align='start'
					onInteractOutside={e => {
						e.preventDefault();
					}}
				>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={r => onSelection(r)}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
