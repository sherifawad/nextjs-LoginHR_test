import { SomeZodObject, z } from "zod";

// export const Pagination = z.object({
// 	page: z.number().default(1),
// 	pageSize: z.number().default(100),
//   sortBy:z.string()
// 	sort: z.enum(["asc", "desc"]).default("desc"),
// });

// export type Pagination = z.infer<typeof Pagination>;

export const sortingSchema = z.enum(["asc", "desc"]).default("desc");
export type SortingType = z.infer<typeof sortingSchema>;

export const Pagination = <T extends SomeZodObject>(dataType: T) =>
	z.object({
		page: z.coerce.number().default(1).optional(),
		pageSize: z.coerce.number().default(100).optional(),
		sort: z.enum(["asc", "desc"]).default("desc").optional(),
		sortBy: z
			.string()
			.default("id")
			.refine(d => {
				return Object.keys(dataType.keyof().Enum).some(
					k => k.toLocaleLowerCase() === d.toLocaleLowerCase(),
				);
			})
			.optional(),
	});

type PaginationType<T extends z.AnyZodObject> = ReturnType<
	typeof Pagination<T>
>;

export type Pagination<T> = z.infer<PaginationType<z.AnyZodObject>>;

export const PaginationResponse = <T extends z.AnyZodObject>(dataType: T) =>
	z.object({
		page: z.number().default(1).optional(),
		pageSize: z.number().default(1000).optional(),
		totalCount: z.number().optional(),
		totalPages: z.number().default(1),
		sort: z.enum(["asc", "desc"]).optional(),
		sortBy: dataType.keyof().optional(),
		items: z.array(dataType),
	});

type PaginationResponseType<TType extends z.AnyZodObject> = ReturnType<
	typeof PaginationResponse<TType>
>;

export type PaginationResponse<T> = z.infer<
	PaginationResponseType<z.AnyZodObject>
>;

type ErrorResult = {
	error: string;
};

export type PaginationResponseResult<T> =
	| ErrorResult
	| {
			data: PaginationResponse<T>;
	  };

export const GetPaginationResponse = async <T>(
	result: PaginationResponseType<z.AnyZodObject>,
	schema: z.AnyZodObject,
): Promise<PaginationResponseResult<z.AnyZodObject>> => {
	try {
		const data = PaginationResponse(schema).parse(result);
		return {
			data: data,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : `${error}`,
		};
	}
};
