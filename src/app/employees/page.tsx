import { Employee } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";
import { GetAllEmployeesAction } from "../(actions)/_EmployeesActions";
import EmployeesTable from "./(content)/table/employees-table";
import { EmployeeSearchParamsSchema } from "./schema";

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};

async function EmployeesPage({ searchParams }: Props) {
	const fetchedEmployees = await paginatedEmployees({
		searchParams,
	});
	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employees List
			</h1>

			<EmployeesTable
				employeesList={fetchedEmployees?.items || []}
				page={fetchedEmployees?.page || 1}
				pageSize={fetchedEmployees?.pageSize || 0}
				totalCount={fetchedEmployees?.totalCount || 0}
				totalPages={fetchedEmployees?.totalPages || 1}
				searchParams={searchParams}
			/>
		</div>
	);
}

const paginatedEmployees = async ({ searchParams }: Props) => {
	let pagination: Pagination<Employee> = {
		page: 1,
		pageSize: 100,
		sortBy: "name",
		sort: "asc",
	};
	const validateSearchParams =
		EmployeeSearchParamsSchema.safeParse(searchParams);

	if (validateSearchParams.success) {
		const { employee, ...rest } = validateSearchParams.data;
		pagination = {
			...pagination,
			...rest,
		};
	}
	return await GetAllEmployeesAction(pagination);
};

export default EmployeesPage;
