import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import FilterPopUpForm from "./form";

type Props = {
	addFilter: (filter: Filter) => void;
};
function FilterPopUp({ addFilter }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<div className='self-start rounded-md bg-muted p-1'>
					<Plus className='h-3 w-3' />
				</div>
			</PopoverTrigger>
			<PopoverContent className=' p-0'>
				<FilterPopUpForm setIsOpen={setIsOpen} addFilter={addFilter} />
			</PopoverContent>
		</Popover>
	);
}

export default FilterPopUp;
