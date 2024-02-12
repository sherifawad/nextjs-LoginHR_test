import { GetAllEmployees } from "@/app/profile/_actions";
import EmployeesList from "./table/employees-list";

async function FilteredList() {
	const employees = await GetAllEmployees();
	return (
		<section>
			<EmployeesList employeesList={employees} />
		</section>
	);
}

export default FilteredList;
