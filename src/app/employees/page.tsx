import TableSkeleton from "@/app/employees/(content)/table/tableSkeletotn";
import {
	dataToStringWithCustomSeparator,
	getReadableFilterValues,
} from "@/lib/utils/filterUtils";
import { FilterOption } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { Suspense } from "react";
import { GetAllEmployees } from "../profile/_actions";
import { BasicSearchParamsSchema } from "../searchUrlSchema";
import FilteredEmployees from "./(content)";
import { getFilteredEmployees } from "./_actions";

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};
async function EmployeesPage({ searchParams }: Props) {
	// get all employees

	const initialEmployees = await GetAllEmployees();

	// const initialEmployees = await GetAllEmployees();
	let filteredEmployees = initialEmployees;
	// set empty filters
	let initialFilters: FilterOption[] = [];
	let employeeToEdit: Employee | undefined = undefined;
	//validate search params
	const validateSearchParams = BasicSearchParamsSchema.safeParse(searchParams);
	if (validateSearchParams.success) {
		// check if there are filter in searchParams

		if (validateSearchParams.data.filter) {
			initialFilters = validateSearchParams.data.filter.map(fv => {
				const readableFilter = getReadableFilterValues(fv, initialEmployees);
				const basicString = `${fv.property}_${fv.operation}_`;
				const createdFilterValueString = `${basicString}${dataToStringWithCustomSeparator(fv.data)}`;
				const createdFilterLabelString = `${basicString}${readableFilter.data}`;
				return {
					label: createdFilterLabelString,
					value: createdFilterValueString,
				};
			});
			filteredEmployees = await getFilteredEmployees(
				initialFilters.map(f => f.value),
			);
		}
		if (filteredEmployees.length > 0 && validateSearchParams.data.employee) {
			const employee = filteredEmployees.find(
				f => f.code === validateSearchParams.data.employee,
			);
			if (employee) {
				employeeToEdit = employee;
			}
		}
	}

	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employees List
			</h1>
			<section>
				<Suspense fallback={<TableSkeleton />}>
					<FilteredEmployees
						initialEmployees={filteredEmployees}
						initialFilters={initialFilters}
						employeeToEdit={employeeToEdit}
					/>
				</Suspense>
			</section>
		</div>
	);
}

export default EmployeesPage;
