import FilteredList from "@/components/filteredList";
import FilterList from "@/components/filters/filterList";

function EmployeesPage() {
	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employees List
			</h1>
			<FilterList />
			<section>
				<FilteredList />
			</section>
		</div>
	);
}

export default EmployeesPage;
