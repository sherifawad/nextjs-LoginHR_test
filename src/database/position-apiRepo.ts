import "server-only";

import { FetchResult, GetServerResponse } from "@/lib/utils/apiFetch";
import { EmployeePosition } from "@/validation/employeeSchema";
import { encode } from "base-64";
import { env } from "process";
import { z } from "zod";

const codeSchema = z.number().int().positive();

export async function getAllJobs(): Promise<FetchResult<EmployeePosition[]>> {
	try {
		const response = await fetch(`${env.API_URL}/position/getall`, {
			headers: new Headers({
				Authorization: `Basic ${encode(`${env.userName}:${env.password}`)}`,
				"Content-Type": "application/json",
			}),
		});
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(
				result,
				EmployeePosition.array(),
			);
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

export async function findByCode(
	code: number,
): Promise<FetchResult<EmployeePosition>> {
	try {
		const response = await fetch(`${env.API_URL}/position/${code}`, {
			headers: new Headers({
				Authorization: `Basic ${encode(`${env.userName}:${env.password}`)}`,
				"Content-Type": "application/json",
			}),
		});
		if (response.ok) {
			const result = await response.json();
			const ServerResponse = await GetServerResponse(result, EmployeePosition);
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
