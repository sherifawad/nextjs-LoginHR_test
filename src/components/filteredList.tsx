import { GetAllEmployeesAction } from "@/app/(actions)/_EmployeesActions";
import EmployeesList from "./table/employees-list";

async function FilteredList() {
	const employees = await GetAllEmployeesAction();
	return (
		<section>
			<EmployeesList employeesList={employees?.items || []} />
		</section>
	);
}

export default FilteredList;
