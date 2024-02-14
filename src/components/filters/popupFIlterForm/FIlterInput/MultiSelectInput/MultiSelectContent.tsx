import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { FilterOption } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CheckIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
	options: FilterOption[];
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedValues: Dispatch<SetStateAction<FilterOption[] | undefined>>;
	selectedValues: FilterOption[] | undefined;
	onValuesChange: (values: string[]) => void;
};

function MultiSelectContent({
	options,
	setIsOpen,
	setSelectedValues,
	selectedValues,
	onValuesChange,
}: Props) {
	const onValuesSelection = (values: FilterOption[]) => {
		setSelectedValues(values);
		if (values.length > 0) {
			const selectedArray = values.map(v =>
				v.value.toString().toLocaleLowerCase(),
			);
			onValuesChange(selectedArray);
		}
	};
	return (
		<div className=''>
			<Command>
				<CommandInput placeholder={"title"} />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<ScrollArea className='max-h-72'>
						<CommandGroup>
							{options.map(option => {
								const isSelected = (selectedValues as any[])?.find(
									x => x.value === option.value,
								);
								return (
									<CommandItem
										key={option.label}
										onSelect={() => {
											let values = [];
											if (isSelected) {
												values = ((selectedValues as any[]) ?? []).filter(
													x => x.value !== option.value,
												);
											} else {
												values = [...((selectedValues as any[]) ?? []), option];
											}
											onValuesSelection(values);
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("h-4 w-4")} />
										</div>
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</ScrollArea>
					<CommandSeparator />
					{selectedValues && ((selectedValues as any[]) ?? []).length > 0 && (
						<div className='flex  flex-row items-center gap-x-2 p-2'>
							<Button
								variant={"ghost"}
								onClick={() => setSelectedValues([])}
								className=''
							>
								Clear filters
							</Button>
							<div className='flex flex-1 justify-end'>
								<Button className='' onClick={() => setIsOpen(false)}>
									Save
								</Button>
							</div>
						</div>
					)}
				</CommandList>
			</Command>
		</div>
	);
}

export default MultiSelectContent;
