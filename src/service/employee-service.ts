import "server-only";

import {
	deleteEmployeeAsync,
	getEmployeeByIdAsync,
	getEmployeesAsync,
	updateEmployeeAsync,
} from "@/lib/repo/employees-repo";
import {
	Employee,
	EmployeeOptionalSchema,
	EmployeeSchema,
} from "@/validation/generated-zod-schemas";
import {
	Pagination,
	PaginationResponse,
} from "@/validation/pagination-validation";
import { z } from "zod";
const codeSchema = z.number().int().positive();

export async function getAllEmployees(pagination?: Pagination<Employee>) {
	try {
		if (pagination) {
			const validate = Pagination(EmployeeSchema).parse(pagination);
			const response = await getEmployeesAsync(validate);
			const paginationResult =
				PaginationResponse(EmployeeSchema).parse(response);
			return {
				data: paginationResult,
			};
		} else {
			const response = await getEmployeesAsync();
			const paginationResult =
				PaginationResponse(EmployeeSchema).parse(response);
			return {
				data: paginationResult,
			};
		}
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
}
export async function getEmployeeById(params: {
	id: number;
	complete: boolean;
}) {
	const schema = z.object({
		id: z.number().int().positive(),
		complete: z.boolean().optional(),
	});
	try {
		const validate = schema.parse(params);
		const result = await getEmployeeByIdAsync(validate);
		return {
			data: result,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
}
export async function deleteEmployee(params: { id: number }) {
	const schema = z.object({
		id: z.number().int().positive(),
	});
	try {
		const validate = schema.parse(params);
		const result = await deleteEmployeeAsync(validate);
		return {
			data: result,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
}
export async function updateEmployee(params: {
	id: number;
	employee: Partial<Employee>;
}) {
	const schema = z.object({
		id: z.number().int().positive(),
		employee: EmployeeOptionalSchema,
	});
	try {
		const validate = schema.parse(params);
		const result = await updateEmployeeAsync(validate);
		return {
			data: result,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
}
