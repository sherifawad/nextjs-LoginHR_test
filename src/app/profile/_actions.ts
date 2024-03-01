"use server";

import {
	_delete,
	create,
	getByCode,
	getMany,
	getNewCode,
	getOne,
	update,
} from "@/database/employees-dataBase";
import { findByCode, getAllJobs } from "@/database/jobs-DataBase";
import { Employee, EmployeeSchema } from "@/validation/generated-zod-schemas";

export async function UpdateEmployee(
	code: number,
	params: { [x in keyof Employee]: Employee[x] },
) {
	return update(code, params);
}
export async function CreateEmployee(employee: Employee) {
	const validate = EmployeeSchema.safeParse(employee);
	if (!validate.success) throw new Error("Invalid Params");
	return create(validate.data);
}
export async function DeleteEmployee(code: number) {
	return _delete(code);
}

export async function GetEmployeeUnique(code: number) {
	return getByCode(code);
}
export async function GetEmployee(x: (x: Employee) => boolean) {
	return getOne(x);
}
export async function GetEmployees(x: (x: Employee) => boolean) {
	return getMany(x);
}
export async function GetNewEmployee() {
	return getNewCode();
}

export async function GetAllJobs() {
	return await getAllJobs();
}
export async function GetJob(code: number) {
	return await findByCode(code);
}
