import { Employee } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";
import "server-only";
import { prisma } from "../prisma";

export async function getEmployeesAsync(pagination?: Pagination<Employee>) {
	try {
		const count = await prisma.employee.count();

		if (!pagination?.pageSize || !pagination?.page) {
			const employees = (await prisma.employee.findMany({
				orderBy: {
					[pagination?.sortBy || "id"]: pagination?.sort || "desc",
				},
			})) as Employee[];
			return {
				page: 1,
				pageSize: count,
				totalCount: count,
				sort: pagination?.sort || "desc",
				totalPages: 1,
				sortBy: pagination?.sortBy || "id",
				items: employees,
			};
		}

		const take = pagination?.pageSize || 1000;
		var skip = ((pagination?.page || 1) - 1) * take;
		const employees = (await prisma.employee.findMany({
			skip,
			orderBy: {
				[pagination?.sortBy || "id"]: pagination?.sort || "desc",
			},
			take,
		})) as Employee[];

		return {
			page: pagination?.page || 1,
			pageSize: pagination?.pageSize,
			totalCount: count,
			sort: pagination?.sort,
			totalPages: Math.ceil(count / (pagination?.pageSize || 1)),
			sortBy: pagination?.sortBy,
			items: employees,
		};
	} catch (error) {
		throw error;
	}
}

export async function getEmployeeByIdAsync({
	id,
	complete = true,
}: {
	id: number;
	complete?: boolean;
}) {
	try {
		const employee = (await prisma.employee.findUniqueOrThrow({
			where: {
				id,
			},
			include: {
				Position: complete,
			},
		})) as Employee;

		return employee;
	} catch (error) {
		throw error;
	}
}

export async function deleteEmployeeAsync({ id }: { id: number }) {
	try {
		const employee = (await prisma.employee.delete({
			where: {
				id,
			},
		})) as Employee;

		return employee;
	} catch (error) {
		throw error;
	}
}
export async function updateEmployeeAsync({
	employee,
	id,
}: {
	id: number;
	employee: Partial<Employee>;
}) {
	try {
		const updatedEmployee = (await prisma.employee.update({
			where: {
				id,
			},
			data: { ...employee },
		})) as Employee;

		return employee;
	} catch (error) {
		throw error;
	}
}
