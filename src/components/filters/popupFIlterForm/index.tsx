import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FilterResult } from "../filterList";
import FilterPopUpForm from "./form";

type Props = {
	addFilter: (filter: EmployeeFilter) => Promise<FilterResult>;
	initialEmployees: Employee[];
};
function FilterPopUp({ addFilter, initialEmployees }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<div className='self-start rounded-md bg-muted p-1'>
					<Plus className='h-3 w-3' />
				</div>
			</PopoverTrigger>
			<PopoverContent className=' p-0'>
				<FilterPopUpForm
					setIsOpen={setIsOpen}
					addFilter={addFilter}
					initialEmployees={initialEmployees}
				/>
			</PopoverContent>
		</Popover>
	);
}

export default FilterPopUp;
