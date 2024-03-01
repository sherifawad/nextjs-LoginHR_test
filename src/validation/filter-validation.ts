import {
	isArray,
	isArrayDate,
	isArrayNumber,
	isArrayString,
} from "@/lib/utils/array";
import { normalizeType } from "@/lib/utils/filterUtils";
import { SomeZodObject, z } from "zod";
import { filterOperatorSchema } from "./filter-operator-validation";
import { EmployeeSchema } from "./generated-zod-schemas";

enum SalaryStatus {
	VALID,
	NOT_VALID,
}

export const SalaryStatusEnum = z.nativeEnum(SalaryStatus);

export const EmployeePosition = z.object({
	positionName: z.string().min(1),
	positionCode: z.coerce.number().int().min(1).positive(),
});

export const EmployeeFilter = z
	.object({
		property: EmployeeSchema.keyof(),
		operation: filterOperatorSchema,
		data: z.union([z.string(), z.string().array()]),
	})
	.refine(
		data => {
			if (isArray(data.data)) {
				if (
					isArrayDate(data.data) ||
					isArrayString(data.data) ||
					isArrayNumber(data.data)
				) {
					return true;
				}
				return true;
			}
			if (
				typeof data.data === "number" ||
				typeof data.data === "string" ||
				Object.prototype.toString.call(new Date(+data.data)) === "[object Date]"
			) {
				return true;
			}
			return false;
		},
		{
			path: ["data"],
		},
	);

export type EmployeeFilter = z.infer<typeof EmployeeFilter>;
export type SalaryStatusEnum = z.infer<typeof SalaryStatusEnum>;

export const FilterItemObject = <T extends SomeZodObject>(dataType: T) =>
	z
		.object({
			Property: z.string().refine(d => {
				return Object.keys(dataType.keyof().Enum).some(
					k => k.toLocaleLowerCase() === d.toLocaleLowerCase(),
				);
			}),
			Operator: filterOperatorSchema,
			Value: z
				.object({
					label: z.string(),
					value: z.any(),
				})
				.array(),
		})
		.refine(
			data => {
				console.log("🚀 ~ dataType:", dataType.shape);
				const _type = Object.entries(dataType.shape).find(
					([key]) =>
						key.toLocaleLowerCase() === data.Property.toLocaleLowerCase(),
				);

				if (
					!_type ||
					Object.keys(_type).length === 0 ||
					!_type[1]?._def.typeName
				)
					return false;

				let _definition = _type[1];
				const innerDefinition = Object.entries(_type[1]._def).find(
					([key]) =>
						key.toLocaleLowerCase() === "innerType".toLocaleLowerCase(),
				);

				// while (
				// 	_type[1] instanceof ZodOptional ||
				// 	_type[1] instanceof ZodNullable
				// ) {
				// 	_definition = _type[1].unwrap();
				// }
				// if (innerDefinition) {
				// 	_definition = innerDefinition[1];
				// }
				const _normalizeType = normalizeType(_type[1]);

				switch (_normalizeType?._def.typeName) {
					case "ZodNumber":
						return data.Value.every(
							v => _normalizeType.safeParse(Number(v.value)).success,
						);

					case "ZodString":
						return data.Value.every(
							v => _normalizeType.safeParse(String(v.value)).success,
						);
					case "ZodDate":
						return data.Value.every(
							v => _normalizeType.safeParse(new Date(v.value)).success,
						);

					default:
						return data.Value.every(
							v => _normalizeType.safeParse(v.value).success,
						);
				}
			},
			{
				message: "Field and Value types not the same",
				path: ["Value"],
			},
		);

export type FilterItemObjectType<T extends z.AnyZodObject> = ReturnType<
	typeof FilterItemObject<T>
>;

export type FilterItemObject<T> = z.infer<FilterItemObjectType<z.AnyZodObject>>;

export const FilterItem = <T extends SomeZodObject>(dataType: T) =>
	z
		.object({
			Field: z.string().refine(d => {
				return Object.keys(dataType.keyof().Enum).some(
					k => k.toLocaleLowerCase() === d.toLocaleLowerCase(),
				);
			}),
			Operator: filterOperatorSchema,
			Value: z.any(),
		})
		.refine(
			data => {
				const _type = Object.entries(dataType.shape).find(
					([key]) => key.toLocaleLowerCase() === data.Field.toLocaleLowerCase(),
				);

				if (
					!_type ||
					Object.keys(_type).length === 0 ||
					!_type[1]?._def.typeName
				)
					return false;
				switch (_type[1]?._def.typeName) {
					case "ZodNumber":
						if (isArray(data.Value)) {
							return Array.from(data.Value).every(
								v => _type[1].safeParse(Number(v)).success,
							);
						} else {
							return _type[1].safeParse(Number(data.Value)).success;
						}
					case "ZodString":
						if (isArray(data.Value)) {
							return Array.from(data.Value).every(
								v => _type[1].safeParse(String(v)).success,
							);
						} else {
							return _type[1].safeParse(String(data.Value)).success;
						}
					case "ZodDate":
						if (isArray(data.Value)) {
							return Array.from(data.Value).every(
								v => _type[1].safeParse(new Date(v as any)).success,
							);
						} else {
							return _type[1].safeParse(new Date(data.Value)).success;
						}

					default:
						if (isArray(data.Value)) {
							return Array.from(data.Value).every(
								v => _type[1].safeParse(v as any).success,
							);
						} else {
							return _type[1].safeParse(data.Value).success;
						}
				}
			},
			{
				message: "Field and Value types not the same",
				path: ["Value"],
			},
		);

export type FilterItemType<T extends z.AnyZodObject> = ReturnType<
	typeof FilterItem<T>
>;

export type FilterItem<T> = z.infer<FilterItemType<z.AnyZodObject>>;

type Result<T> = {
	[Key in keyof T]: () => T[Key];
};

const transform = <T extends object>(obj: T): Result<T> => {
	return Object.fromEntries(
		Object.keys(obj).map(key => [key, () => obj[key as keyof T]]),
	) as Result<T>;
};

const hash = {
	first: "someString",
	second: 2,
	third: 3,
};

const a = transform(hash);

const first = a.first(); // returns "string"
//    ^? const first: string
const second = a.second(); // return "number"
//    ^? const second: number
