"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { GetAllPositions } from "@/app/(actions)/_positionsActions";
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
import { Position } from "@/validation/generated-zod-schemas";
type Props = {
	selectedValue?: number | null;
	onSelection: (job: number | null) => void;
};

function PositionComboBox({ selectedValue, onSelection }: Props) {
	const [jobs, setJobs] = React.useState<Position[]>([]);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		try {
			const fetchData = async () => {
				const result = await GetAllPositions();
				setJobs(result?.items || []);
			};
			fetchData();
		} catch (error) {}
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
						? jobs.find(x => x.code === selectedValue)?.name ??
							"Select option..."
						: "Select option..."}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search option...' />
					<CommandEmpty>No option found.</CommandEmpty>
					<CommandGroup>
						{jobs.map(j => (
							<CommandItem
								key={j.id}
								value={j.id + ""}
								onSelect={async currentValue => {
									const selectedJob = jobs.find(j => j.id === +currentValue);
									onSelection(j.id);
									setOpen(false);
								}}
							>
								{j.name}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default PositionComboBox;
