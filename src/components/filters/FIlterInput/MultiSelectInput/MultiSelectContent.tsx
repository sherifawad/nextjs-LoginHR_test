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
import { SelectionType } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CheckIcon } from "lucide-react";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";

type Props = {
	options: SelectionType[];
	setIsOpen?: Dispatch<SetStateAction<boolean>>;
	selectedValues?: string[];
	onValuesChange: (values: string[]) => void;
	title?: string;
	className?: string;
	disabled?: boolean;
};

function MultiSelectContent({
	options,
	setIsOpen,
	selectedValues,
	onValuesChange,
	className,
	disabled,
	title = "title",
}: Props) {
	const [values, setValues] = useState<SelectionType[]>([]);
	const onValuesSelection = useCallback(
		(valuesSelected: SelectionType[]) => {
			setValues(valuesSelected);
			if (valuesSelected.length > 0) {
				const selectedArray = valuesSelected.map(v =>
					v.value.toString().toLocaleLowerCase(),
				);
				onValuesChange(selectedArray);
			}
		},
		[onValuesChange],
	);

	useEffect(() => {
		if (
			!options ||
			options.length < 1 ||
			!selectedValues ||
			selectedValues.length < 1
		)
			return;
		setValues(options.filter(opt => selectedValues.includes(opt.value)));
	}, [options, selectedValues]);

	return (
		<div className={className}>
			<Command>
				<CommandInput placeholder={title} disabled={disabled} />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<ScrollArea className='max-h-72'>
						<CommandGroup>
							{options.map(option => {
								const isSelected = (values as any[])?.find(
									x => x.value === option.value,
								);
								return (
									<CommandItem
										key={option.label}
										onSelect={() => {
											let LValues = [];
											if (isSelected) {
												LValues = values.filter(x => x.value !== option.value);
											} else {
												LValues = [...values, option];
											}
											onValuesSelection(LValues);
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
					{values && values.length > 0 && (
						<div className='flex  flex-row items-center gap-x-2 p-2'>
							<Button
								variant={"ghost"}
								onClick={() => setValues([])}
								className=''
							>
								Clear filters
							</Button>
							<div className='flex flex-1 justify-end'>
								<Button
									className=''
									onClick={() => (setIsOpen ? setIsOpen(false) : undefined)}
								>
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
