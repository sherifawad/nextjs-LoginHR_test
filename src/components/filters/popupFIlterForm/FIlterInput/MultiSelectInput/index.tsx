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
import { BasicValues, FilterOption } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import MultiSelectContent from "./MultiSelectContent";

type Props = {
	options: FilterOption[];
	values: BasicValues | undefined;
	onValuesChange: (values: BasicValues | undefined) => void;
};

function MultiSelectInput({ options, values, onValuesChange }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValues, setSelectedValues] = useState<BasicValues | undefined>(
		values,
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' className='h-8 border-dashed'>
					<Plus className='mr-2 h-4 w-4' />
					title
					{selectedValues && ((selectedValues as any[]) ?? [])?.length > 0 && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge
								variant='secondary'
								className='mx-1 rounded-sm font-normal lg:hidden'
							>
								{((selectedValues as any[]) ?? []).length}
							</Badge>
							<div className='hidden space-x-1 md:flex'>
								{((selectedValues as any[]) ?? []).length > 2 ? (
									<Badge
										variant='secondary'
										className='rounded-sm px-1 font-normal'
									>
										{((selectedValues as any[]) ?? []).length} selected
									</Badge>
								) : (
									options
										.filter(
											option =>
												((selectedValues as any[]) ?? [])?.indexOf(
													option.value,
												) !== -1,
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
			<DialogContent>
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
