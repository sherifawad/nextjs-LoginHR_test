import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Props = {
	employeesList: Employee[];
	addFilter: (filter: EmployeeFilter) => Promise<void>;
};

function EmployeesList({ employeesList, addFilter }: Props) {
	return (
		<DataTable columns={columns} data={employeesList} addFilter={addFilter} />
	);
}

export default EmployeesList;
