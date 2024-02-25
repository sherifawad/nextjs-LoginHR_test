"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { GetAllJobs } from "@/app/profile/_actions";
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
import { EmployeePosition } from "@/validation/employeeSchema";
type Props = {
	selectedValue: number | null;
	onSelection: (job: number | null) => void;
};

function ComboBox({ selectedValue, onSelection }: Props) {
	const [jobs, setJobs] = React.useState<EmployeePosition[]>([]);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const fetchData = async () => {
			const result = await GetAllJobs();
			if (result.status === "success") {
				setJobs(result.data);
			}
		};
		fetchData();
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className=' h-11 w-full justify-between bg-muted'
				>
					{selectedValue
						? jobs.find(x => x.positionCode === selectedValue)?.positionName ??
							"Select option..."
						: "Select option..."}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Command>
					<CommandInput placeholder='Search option...' />
					<CommandEmpty>No option found.</CommandEmpty>
					<CommandGroup>
						{jobs.map(j => (
							<CommandItem
								key={j.positionCode}
								value={j.positionCode + ""}
								onSelect={async currentValue => {
									const selectedJob = jobs.find(
										j => j.positionCode === +currentValue,
									);
									onSelection(j.positionCode);
									setOpen(false);
								}}
							>
								{j.positionName}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default ComboBox;
