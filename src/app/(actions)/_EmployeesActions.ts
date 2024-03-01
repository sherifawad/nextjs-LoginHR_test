"use server";

import {
	deleteEmployee,
	getAllEmployees,
	getEmployeeById,
	updateEmployee,
} from "@/service/employee-service";
import { Employee } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";
import { revalidatePath } from "next/cache";

export async function GetAllEmployeesAction(pagination?: Pagination<Employee>) {
	const result = await getAllEmployees(pagination);
	if (result.error) throw result.error;
	return result.data;
}
export async function GetUniqueEmployeeAction({
	id,
	complete = true,
}: {
	id: number;
	complete?: boolean;
}) {
	const result = await getEmployeeById({ id, complete });
	if (result.error) throw result.error;
	return result.data;
}
export async function DeleteEmployeeAction({ id }: { id: number }) {
	const result = await deleteEmployee({ id });
	if (result.error) throw result.error;
	revalidatePath("/employees");
	return result.data;
}
export async function UpdateEmployeeAction({
	id,
	employee,
}: {
	id: number;
	employee: Partial<Employee>;
}) {
	const result = await updateEmployee({ id, employee });
	if (result.error) throw result.error;
	revalidatePath("/employees");
	return result.data;
}
