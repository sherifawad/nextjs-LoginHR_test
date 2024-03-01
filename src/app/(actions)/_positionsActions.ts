"use server";

import { getAllPositions, getPositionById } from "@/service/job-service";
import { Position } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";

export async function GetAllPositions(pagination?: Pagination<Position>) {
	const result = await getAllPositions(pagination);
	if (result.error) throw result.error;
	return result.data;
}
export async function GetUniquePosition({
	id,
	complete = true,
}: {
	id: number;
	complete?: boolean;
}) {
	const result = await getPositionById({ id, complete });
	if (result.error) throw result.error;
	return result.data;
}
