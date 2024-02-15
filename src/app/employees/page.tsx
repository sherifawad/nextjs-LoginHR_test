import FilterList from "@/components/filters/filterList";
import { EmployeeFilter } from "@/validation/employeeSchema";
import { Suspense } from "react";
import { GetAllEmployees } from "../profile/_actions";

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};
async function EmployeesPage({ searchParams }: Props) {
	// get all employees
	const employees = await GetAllEmployees();
	// set empty filters
	let initialFilters: { [key: string]: EmployeeFilter }[] = [];
	//validate search params
	// const validateSearchParams = BasicSearchParamsSchema.safeParse(searchParams);
	// if (validateSearchParams.success) {
	// 	// check if there are filter in searchParams
	// 	if (validateSearchParams.data.filter) {
	// 		// validate and convert filter string  and assign it to initial filter list
	// 		initialFilters = searchParamsToFilter(validateSearchParams.data.filter);
	// 	}
	// }

	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employees List
			</h1>
			<section>
				<Suspense fallback={<>Loading ....</>}>
					<FilterList
						initialEmployees={employees}
						initialFilters={initialFilters}
					/>
				</Suspense>
			</section>
		</div>
	);
}

export default EmployeesPage;
