"use server";

import {
	_delete,
	create,
	getAll,
	getByCode,
	getNewCode,
	update,
} from "@/database/employees-apiRepo";
import { findByCode, getAllJobs } from "@/database/position-apiRepo";
import { Employee } from "@/validation/employeeSchema";
import { revalidatePath } from "next/cache";

export async function UpdateEmployee(
	code: number,
	employee: Employee,
): Promise<Employee> {
	const result = await update(code, employee);
	if (result.status === "error") throw new Error(result.message);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return result.data;
}
export async function CreateEmployee(employee: Employee): Promise<Employee> {
	const result = await create(employee);
	if (result.status === "error") throw new Error(result.message);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return result.data;
}
export async function DeleteEmployee(code: number) {
	const result = await _delete(code);
	if (result.status === "error") throw new Error(result.message);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return result.data;
}
export async function GetAllEmployees(): Promise<Employee[]> {
	const result = await getAll();
	if (result.status === "error") return [];
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return result.data;
}
export async function GetEmployeeUnique(
	code: number,
): Promise<Employee | undefined> {
	const result = await getByCode(code);
	if (result.status === "error") return undefined;

	return result.data;
}
export async function GetEmployee(
	x: (x: Employee) => boolean,
): Promise<Employee | undefined> {
	const result = await getAll();
	if (result.status === "error") return undefined;
	return result.data.find(x) ?? undefined;
}
export async function GetEmployees(
	x: (x: Employee) => boolean,
): Promise<Employee[]> {
	const result = await getAll();
	if (result.status === "error") return [];
	return result.data.filter(x);
}
export async function GetNewEmployee(): Promise<number> {
	const result = await getNewCode();
	if (result.status === "error") throw new Error(result.message);
	return result.data;
}

export async function GetAllJobs() {
	return await getAllJobs();
}
export async function GetJob(code: number) {
	return await findByCode(code);
}
