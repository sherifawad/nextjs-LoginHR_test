import { GetAllEmployeesAction } from "@/app/profile/_actions";
import EmployeesList from "./table/employees-list";

async function FilteredList() {
	const employees = await GetAllEmployeesAction();
	return (
		<section>
			<EmployeesList employeesList={employees?.items} />
		</section>
	);
}

export default FilteredList;
