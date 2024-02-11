import FilteredList from "@/components/filteredList";

function EmployeesPage() {
	return (
		<>
			<h1 className='py-8 text-3xl font-bold text-primary'>Employees List</h1>
			<section>
				<FilteredList />
			</section>
		</>
	);
}

export default EmployeesPage;
