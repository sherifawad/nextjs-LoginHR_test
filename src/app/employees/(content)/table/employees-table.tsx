"use client";

import { DeleteEmployeeAction } from "@/app/(actions)/_EmployeesActions";
import { useToast } from "@/components/ui/use-toast";
import { Employee } from "@/validation/generated-zod-schemas";
import { useCallback } from "react";
import EmployeeProvider from "../../employeeContext";
import FilterList from "../filterList";
import { EmployeesDataTable } from "./data-table";
import { employeesColumns } from "./employees-table-columns";

type Props = {
	employeesList: Employee[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	searchParams: { [key: string]: string | string[] | undefined };
};

function EmployeesTable({
	employeesList,
	page,
	pageSize,
	totalCount,
	totalPages,
	searchParams,
}: Props) {
	const { toast } = useToast();

	const deleteEmployee = useCallback(
		async (id: number) => {
			try {
				const deletedEmployee = await DeleteEmployeeAction({ id });
				if (deletedEmployee) {
					toast({
						variant: "success",
						title: `${deletedEmployee.name} deleted Successfully`,
					});
				}
			} catch (error) {
				let errorMessage = error;
				if (error instanceof Error) {
					error = error.message;
				}
				toast({
					variant: "destructive",
					title: "Uh oh! Something went wrong.",
					description: `${errorMessage}`,
				});
			}
		},
		[toast],
	);

	return (
		<div className='space-y-4'>
			<EmployeeProvider>
				<FilterList />

				<EmployeesDataTable
					columns={employeesColumns({ onDelete: deleteEmployee })}
					data={employeesList}
					page={page}
					pageSize={pageSize}
					totalCount={totalCount}
					totalPages={totalPages}
					searchParams={searchParams}
				/>
			</EmployeeProvider>
		</div>
	);
}

export default EmployeesTable;
