import { Employee, Position } from "@/validation/generated-zod-schemas";
import { Pagination } from "@/validation/pagination-validation";
import "server-only";
import { prisma } from "../prisma";

export async function getPositionsAsync(pagination?: Pagination<Position>) {
	try {
		const count = await prisma.position.count();

		if (!pagination?.pageSize || !pagination?.page) {
			const positions = (await prisma.position.findMany({
				orderBy: {
					[pagination?.sortBy || "id"]: pagination?.sort || "desc",
				},
			})) as Position[];
			return {
				page: 1,
				pageSize: count,
				totalCount: count,
				sort: pagination?.sort || "desc",
				totalPages: 1,
				sortBy: pagination?.sortBy || "id",
				items: positions,
			};
		}

		const take = pagination?.pageSize || 1000;
		var skip = ((pagination?.page || 1) - 1) * take;
		const positions = (await prisma.position.findMany({
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
			items: positions,
		};
	} catch (error) {
		throw error;
	}
}
export async function getPositionByIdAsync({
	id,
	complete = true,
}: {
	id: number;
	complete?: boolean;
}) {
	try {
		const position = (await prisma.position.findUniqueOrThrow({
			where: {
				id,
			},
		})) as Position;

		return position;
	} catch (error) {
		throw error;
	}
}
