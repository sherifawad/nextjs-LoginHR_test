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
import { SelectionType } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SomeZodObject } from "zod";
import MultiSelectContent from "./MultiSelectContent";

type Props<T extends SomeZodObject> = {
	onValueChange: (value?: SelectionType[]) => Promise<void>;
	property?: string;
	selectedValue?: string;
	schema: T;
};

function MultiSelectInput<T extends SomeZodObject>({
	onValueChange,
	selectedValue,
	property,
	schema,
}: Props<T>) {
	const [options, setOptions] = useState<SelectionType[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const [value, setValue] = useState<SelectionType[]>([]);

	// useEffect(() => {
	// 	let isCancelled = false;
	// 	const result = async () => {
	// 		const result = await getSelectedOptions(property);
	// 		if (!isCancelled) {
	// 			setOptions(result);
	// 		}
	// 	};
	// 	result();
	// 	return () => {
	// 		isCancelled = true;
	// 	};
	// }, [property]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='h-8 border-dashed'>
					<Plus className='mr-2 h-4 w-4' />

					{value && value.length > 0 && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge
								variant='secondary'
								className='mx-1 rounded-sm font-normal lg:hidden'
							>
								{value.length}
							</Badge>
							<div className='hidden space-x-1 md:flex'>
								{value.length > 2 ? (
									<Badge
										variant='secondary'
										className='rounded-sm px-1 font-normal'
									>
										{value.length} selected
									</Badge>
								) : (
									options
										.filter(option =>
											value?.some(v => v.value === option.value),
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
					selectedValues={value}
					setSelectedValues={setValue}
					onValuesChange={vs =>
						onValueChange(vs.map(v => ({ label: v, value: v })))
					}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default MultiSelectInput;
