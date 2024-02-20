import "server-only";

import { FetchResult, GetServerResponse } from "@/lib/utils/apiFetch";
import { Employee } from "@/validation/employeeSchema";
import { env } from "process";
import { z } from "zod";

const codeSchema = z.number().int().positive();

export async function getAll(): Promise<FetchResult<Employee[]>> {
	try {
		const response = await fetch(`${env.NEXT_PUBLIC_API_HOST}/employee/getall`);
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, Employee.array());
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}

		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}
export async function getByCode(code: number): Promise<FetchResult<Employee>> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_API_HOST}/employee/${code}`,
		);
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, Employee);
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}

		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}

// export async function getOne(
// 	x: (x: Employee) => boolean,
// ): Promise<Employee | undefined> {
// 	return (await getAll()).find(x);
// }
// export async function getMany(
// 	x: (x: Employee) => boolean,
// ): Promise<Employee[]> {
// 	return (await getAll()).filter(x);
// }
export async function getNewCode(): Promise<FetchResult<number>> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_API_HOST}/employee/GetMaxCode`,
		);
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, codeSchema);
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}
		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}

export async function create(
	employee: Employee,
): Promise<FetchResult<Employee>> {
	try {
		const validateEmployeeInputs = Employee.safeParse(employee);
		if (!validateEmployeeInputs.success) {
			return {
				status: "error",
				message: validateEmployeeInputs.error.issues[0].message,
			};
		}

		const response = await fetch(`${env.NEXT_PUBLIC_API_HOST}/employee`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validateEmployeeInputs.data),
		});
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, Employee);
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}
		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}

export async function update(
	code: number,
	employee: Employee,
): Promise<FetchResult<Employee>> {
	try {
		const validateCodeInputs = codeSchema.safeParse(code);
		if (!validateCodeInputs.success) {
			return {
				status: "error",
				message: validateCodeInputs.error.issues[0].message,
			};
		}
		const validateEmployeeInputs = Employee.safeParse(employee);
		if (!validateEmployeeInputs.success) {
			return {
				status: "error",
				message: validateEmployeeInputs.error.issues[0].message,
			};
		}
		const response = await fetch(
			`${env.NEXT_PUBLIC_API_HOST}/employee/${validateCodeInputs.data}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(validateEmployeeInputs.data),
			},
		);
		if (response.ok) {
			const result = await response.json();
			console.log("🚀 ~ result:", result);
			const ServerResponse = await GetServerResponse(result, Employee);
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}
		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
export async function _delete(code: number): Promise<FetchResult<Employee>> {
	try {
		const validateCodeInputs = codeSchema.safeParse(code);
		if (!validateCodeInputs.success) {
			return {
				status: "error",
				message: validateCodeInputs.error.issues[0].message,
			};
		}

		const response = await fetch(
			`${env.NEXT_PUBLIC_API_HOST}/employee/${code}`,
			{
				method: "DELETE",
			},
		);
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, Employee);
			if (ServerResponse.status === "success") {
				return {
					status: "success",
					data: ServerResponse.data,
				};
			}
			return {
				status: "error",
				message: ServerResponse.message,
			};
		}
		return {
			status: "error",
			message: `${await response.text()}`,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
}
// export async function deleteMany(codeList: number[]): Promise<Employee[]> {
// 	try {
// 		let employees = [...(await getAll())];
// 		const deletedEmployees: Employee[] = [];
// 		const result = employees.filter(x =>
// 			codeList.every(l => {
// 				if (l !== x.code) {
// 					return true;
// 				}
// 				deletedEmployees.push(x);
// 				return false;
// 			}),
// 		);
// 		await saveData(result);

// 		// EmployeesData = [...result];
// 		return deletedEmployees;
// 	} catch (error) {
// 		return [];
// 	}
// }
