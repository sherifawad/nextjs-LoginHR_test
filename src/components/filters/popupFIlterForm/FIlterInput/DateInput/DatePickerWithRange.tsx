"use client";

import { addDays, format } from "date-fns";
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
	onRangeDateSelected: (range: Date[]) => void;
	dateRange: Date[] | undefined;
};

export default function DatePickerWithRange({
	onRangeDateSelected,
	dateRange,
	className,
}: Props) {
	const [date, setDate] = React.useState<DateRange | undefined>(
		dateRange
			? {
					from: dateRange[0],
					to: dateRange[1],
				}
			: undefined,
	);

	const onSelection = (range: DateRange | undefined) => {
		setDate(range);
		if (range && range.from && range.to)
			onRangeDateSelected([addDays(range.from, 1), addDays(range.to, 1)]);
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "PPP")} - {format(date.to, "PPP")}
								</>
							) : (
								format(date.from, "PPP")
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
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
