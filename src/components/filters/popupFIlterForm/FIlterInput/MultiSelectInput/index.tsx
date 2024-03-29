import { getSelectedOptions } from "@/app/_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FilterOption } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import MultiSelectContent from "./MultiSelectContent";

type Props = {
	property: keyof Employee;
	onValuesChange: (values: string[]) => void;
};

function MultiSelectInput({ onValuesChange, property }: Props) {
	const [options, setOptions] = useState<FilterOption[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const [selectedValues, setSelectedValues] = useState<FilterOption[]>([]);

	useEffect(() => {
		let isCancelled = false;
		const result = async () => {
			const result = await getSelectedOptions(property);
			if (!isCancelled) {
				setOptions(result);
			}
		};
		result();
		return () => {
			isCancelled = true;
		};
	}, [property]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='h-8 border-dashed'>
					<Plus className='mr-2 h-4 w-4' />

					{selectedValues && selectedValues.length > 0 && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge
								variant='secondary'
								className='mx-1 rounded-sm font-normal lg:hidden'
							>
								{selectedValues.length}
							</Badge>
							<div className='hidden space-x-1 md:flex'>
								{selectedValues.length > 2 ? (
									<Badge
										variant='secondary'
										className='rounded-sm px-1 font-normal'
									>
										{selectedValues.length} selected
									</Badge>
								) : (
									options
										.filter(option =>
											selectedValues?.some(v => v.value === option.value),
										)
										.map(option => (
											<Badge
												variant='secondary'
												key={option.label}
												className='rounded-sm px-1 font-normal'
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent
				onInteractOutside={e => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>{"title"}</DialogTitle>
				</DialogHeader>
				<MultiSelectContent
					options={options}
					setIsOpen={setIsOpen}
					selectedValues={selectedValues}
					setSelectedValues={setSelectedValues}
					onValuesChange={onValuesChange}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default MultiSelectInput;
