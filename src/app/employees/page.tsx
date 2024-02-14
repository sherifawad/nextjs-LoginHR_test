import FilterList from "@/components/filters/filterList";
import { GetAllEmployees } from "../profile/_actions";

async function EmployeesPage() {
	const employees = await GetAllEmployees();
	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employees List
			</h1>
			<section>
				<FilterList initialEmployees={employees} />
			</section>
		</div>
	);
}

export default EmployeesPage;
