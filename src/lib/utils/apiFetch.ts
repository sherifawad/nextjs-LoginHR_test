import { ZodType, z } from "zod";

export const ServerResponse = <TType extends ZodType>(dataType: TType) =>
	z
		.object({
			success: z.boolean(),
			message: z.string(),
			data: dataType,
		})
		.refine(
			d => {
				if (!d.success || d.message.length > 0) {
					return d.data === null ? true : false;
				}
				return true;
			},
			{
				message: "status success but no data",
				path: ["Data"],
			},
		);

type ServerResponseType<TType extends ZodType> = ReturnType<
	typeof ServerResponse<TType>
>;

type ServerResponse<T> = z.infer<ServerResponseType<ZodType<T>>>;

type ErrorResult = {
	status: "error";
	message: string;
};

export type FetchResult<T> =
	| ErrorResult
	| {
			status: "success";
			data: T;
	  };

export const GetServerResponse = async <T>(
	result: ServerResponseType<ZodType<T>>,
	schema: ZodType<T>,
): Promise<FetchResult<T>> => {
	try {
		const validate = ServerResponse(schema).safeParse(result);
		if (!validate.success) {
			return {
				status: "error",
				message: validate.error.issues[0].message,
			};
		}
		if (validate.data.success) {
			return {
				status: "success",
				data: validate.data.data as T,
			};
		}
		return {
			status: "error",
			message: validate.data.message,
		};
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : `${error}`,
		};
	}
};
