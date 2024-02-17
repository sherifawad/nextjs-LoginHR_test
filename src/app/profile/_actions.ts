"use server";

import {
	_delete,
	create,
	getAll,
	getByCode,
	getMany,
	getNewCode,
	getOne,
	update,
} from "@/database/employees-dataBase";
import { findByCode, getAllJobs } from "@/database/jobs-DataBase";
import { Employee } from "@/validation/employeeSchema";
import { revalidatePath } from "next/cache";

export async function UpdateEmployee(
	code: number,
	params: { [x in keyof Employee]: Employee[x] },
) {
	const updatedData = update(code, params);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return updatedData;
}
export async function CreateEmployee(employee: Employee) {
	const validate = Employee.safeParse(employee);
	if (!validate.success) throw new Error("Invalid Params");
	const created = create(validate.data);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return created;
}
export async function DeleteEmployee(code: number) {
	const deletedData = _delete(code);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return deletedData;
}
export async function GetAllEmployees() {
	const all = await getAll();
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return all;
}
export async function GetEmployeeUnique(code: number) {
	return await getByCode(code);
}
export async function GetEmployee(x: (x: Employee) => boolean) {
	return await getOne(x);
}
export async function GetEmployees(x: (x: Employee) => boolean) {
	return await getMany(x);
}
export async function GetNewEmployee() {
	return await getNewCode();
}

export async function GetAllJobs() {
	return await getAllJobs();
}
export async function GetJob(code: number) {
	return await findByCode(code);
}
