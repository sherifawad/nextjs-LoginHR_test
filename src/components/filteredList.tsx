import { employeesRepo } from "@/database/employees-repo";
import EmployeesList from "./table/employees-list";

async function FilteredList() {
	const { getAll } = employeesRepo;
	const employees = await getAll();
	return (
		<section>
			<EmployeesList employeesList={employees} />
		</section>
	);
}

export default FilteredList;
