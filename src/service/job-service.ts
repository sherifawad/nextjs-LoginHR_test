import "server-only";

import { getPositionByIdAsync, getPositionsAsync } from "@/lib/repo/jobs-repo";
import { Position, PositionSchema } from "@/validation/generated-zod-schemas";
import {
	Pagination,
	PaginationResponse,
} from "@/validation/pagination-validation";
import { z } from "zod";
const codeSchema = z.number().int().positive();

export async function getAllPositions(pagination?: Pagination<Position>) {
	try {
		if (pagination) {
			const validate = Pagination(PositionSchema).parse(pagination);
			const response = await getPositionsAsync(validate);
			const paginationResult =
				PaginationResponse(PositionSchema).parse(response);
			return {
				data: paginationResult,
			};
		} else {
			const response = await getPositionsAsync();
			const paginationResult =
				PaginationResponse(PositionSchema).parse(response);
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
export async function getPositionById(params: {
	id: number;
	complete: boolean;
}) {
	const schema = z.object({
		id: z.number().int().positive(),
		complete: z.boolean().optional(),
	});
	try {
		const validate = schema.parse(params);
		const result = await getPositionByIdAsync(validate);
		return {
			data: result,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
}
