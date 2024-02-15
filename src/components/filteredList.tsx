import { Employee } from "@/validation/employeeSchema";
import EmployeesList from "./table/employees-list";

type FilteredSimpleListProps = {
	initialsList: Employee[];
};

function FilteredSimpleList({ initialsList }: FilteredSimpleListProps) {
	return (
		<section>
			<EmployeesList employeesList={initialsList} />
		</section>
	);
}

export default FilteredSimpleList;
