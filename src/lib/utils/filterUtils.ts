import { BasicValues, FilterOption } from "@/types";

import { Employee } from "@/validation/generated-zod-schemas";
import {
	ZodArray,
	ZodBoolean,
	ZodDate,
	ZodDefault,
	ZodEffects,
	ZodEnum,
	ZodLiteral,
	ZodNativeEnum,
	ZodNullable,
	ZodNumber,
	ZodObject,
	ZodOptional,
	ZodRawShape,
	ZodString,
	ZodType,
	ZodTypeAny,
	z,
} from "zod";
import { enumToLabelKeyValues, isArray } from "./array";

export const generateLabelValueEmployeesList = (
	employeesList: Employee[],
	property: keyof Employee,
): FilterOption[] => {
	// if (property === "salaryStatus") {
	// 	return getSalaryStatusName();
	// }
	const list = employeesList.map(e => e[property]);
	return enumToLabelKeyValues(list);
};

// export const getSalaryStatusName = () => {
// 	const option: FilterOption[] = [];
// 	for (var n in SalaryStatusEnum.enum) {
// 		if (typeof SalaryStatusEnum.enum[n] === "number")
// 			option.push({ label: n, value: SalaryStatusEnum.enum[n] });
// 	}
// 	return option;
// };

export const getLabelValueList = (
	values: string[],
	employeesList: Employee[],
	property: keyof Employee,
): FilterOption[] => {
	const data = generateLabelValueEmployeesList(employeesList, property);
	return data.filter(d =>
		values.some(
			v =>
				v.toString().toLocaleLowerCase() ===
				d.value.toString().toLocaleLowerCase(),
		),
	);
};

export const checkFilterMatch = (
	valueA: EmployeeFilter,
	valueB: EmployeeFilter,
): boolean => {
	return !(
		valueA.operation !== valueB.operation ||
		valueA.property !== valueB.property ||
		valueA.data.toString() !== valueB.data.toString()
	);
};

export const dataToStringWithCustomSeparator = (
	data: BasicValues,
	separator?: string,
): string => {
	if (isArray(data)) {
		return (data as string[]).join(separator || "*");
	}
	return data.toString();
};

export const stringValuesToFilter = (
	searchParams: string,
): EmployeeFilter[] => {
	const result: EmployeeFilter[] = [];
	const filtersList = searchParams.split(",");
	filtersList.forEach(l => {
		const filters = l.split("_");
		if (filters.length !== 3) return;
		const [property, operation, data] = filters;
		const dataList = data.split("*");
		const validate = EmployeeFilter.safeParse({
			property,
			operation,
			// check if is a list of a single number
			data: dataList,
		});

		if (validate.success) {
			result.push(validate.data);
		} else {
			console.log("🚀 ~ validate:", validate.error);
		}
	});
	return result;
};
export const getReadableFilterValues = (
	filter: EmployeeFilter,
	employees: Employee[],
): EmployeeFilter => {
	if (filter.operation === "InList" || filter.operation === "Not-InList") {
		const list = getLabelValueList(
			filter.data as string[],
			employees,
			filter.property,
		);

		filter = {
			...filter,
			data: list.map(l => l.label),
		};
	}
	if (filter.property === "hiringDate") {
		if (isArray(filter.data)) {
			filter = {
				...filter,
				data: (filter.data as string[]).map(l => {
					// isNumber
					return new Intl.DateTimeFormat("en-GB").format(new Date(+l));
				}),
			};
		} else {
			filter = {
				...filter,
				data: new Intl.DateTimeFormat("en-GB").format(new Date(+filter.data)),
			};
		}
	}
	return filter;
};

export function normalizeType(type: ZodType): ZodTypeAny {
	while (
		type instanceof ZodEffects ||
		type instanceof ZodOptional ||
		type instanceof ZodNullable ||
		type instanceof ZodDefault
	) {
		type = type instanceof ZodEffects ? type.innerType() : type._def.innerType;
	}
	return type;
}

export const generateFilterSchema = <Z extends z.ZodType<any>>(
	baseSchema: Z,
) => {
	/** Unwrap nested optionals, nullables, and defaults */
	while (
		baseSchema instanceof z.ZodOptional ||
		baseSchema instanceof z.ZodNullable ||
		baseSchema instanceof z.ZodDefault
	) {
		if (baseSchema instanceof z.ZodDefault) {
			baseSchema = baseSchema.removeDefault();
		}
		if (
			baseSchema instanceof z.ZodNullable ||
			baseSchema instanceof z.ZodOptional
		) {
			baseSchema = baseSchema.unwrap();
		}
	}

	if (
		baseSchema instanceof z.ZodUnion ||
		baseSchema instanceof z.ZodDiscriminatedUnion
	) {
		return z.union(baseSchema.options.map(generateFilterSchema)) as any;
	}

	if (baseSchema instanceof z.ZodArray) {
		return z.array(generateFilterSchema(baseSchema.element)) as any;
	}

	if (baseSchema instanceof z.ZodObject) {
		const shape = Object.entries(baseSchema.shape as ZodRawShape).reduce(
			(acc, [key, value]) => {
				acc[key] = generateFilterSchema(value).optional();
				return acc;
			},
			{} as ZodRawShape,
		);
		return z.object(shape);
	}

	if (baseSchema instanceof z.ZodEnum) {
		return enumFilter(baseSchema);
	}
	if (baseSchema instanceof z.ZodString) {
		if (baseSchema.isDatetime) {
			return dateFilter();
		}
		return stringFilter(baseSchema, baseSchema.isUUID);
	}
	if (baseSchema instanceof z.ZodNumber) {
		return numberFilter(baseSchema);
	}
	if (baseSchema instanceof z.ZodDate) {
		return dateFilter();
	}

	if (baseSchema instanceof z.ZodBoolean) {
		return booleanFilter;
	}

	return z.any();
};

const plainAndBooleanAndArrayFilter = <Z extends ZodTypeAny>(schema: Z) => {
	const plainOrBooleanOrArray = z.union([schema, z.boolean(), z.array(schema)]);

	return z.union([plainOrBooleanOrArray, z.array(plainOrBooleanOrArray)]);
};

const numberFilter = <Z extends z.ZodType<number>>(fieldSchema: Z) =>
	plainAndBooleanAndArrayFilter(
		z.union([
			fieldSchema,
			z.object({
				eq: fieldSchema.optional(),
				gt: fieldSchema.optional(),
				gte: fieldSchema.optional(),
				lt: fieldSchema.optional(),
				lte: fieldSchema.optional(),
				ne: fieldSchema.optional(),
			}),
		]),
	);

const dateFilter = () => {
	const fieldSchema = z.string().datetime().or(z.date());
	return plainAndBooleanAndArrayFilter(
		z.union([
			fieldSchema,
			z.object({
				eq: fieldSchema.optional(),
				gt: fieldSchema.optional(),
				gte: fieldSchema.optional(),
				lt: fieldSchema.optional(),
				lte: fieldSchema.optional(),
				ne: fieldSchema.optional(),
			}),
		]),
	);
};

const booleanFilter = z.boolean();

const stringFilter = <Z extends z.ZodString>(schema: Z, strict?: boolean) =>
	strict
		? z.union([schema, schema.array(), z.boolean()])
		: plainAndBooleanAndArrayFilter(
				z.union([
					schema,
					z.union([
						z.object({
							exact: schema,
						}),
						z.object({
							contains: z.string(),
							not: z.literal(true).optional(),
						}),
					]),
				]),
			).optional();

const enumFilter = <Z extends z.ZodEnum<any>>(schema: Z) =>
	plainAndBooleanAndArrayFilter(schema);

function parseParams(o: any, schema: any, key: string, value: any) {
	// find actual shape definition for this key
	let shape = schema;
	while (shape instanceof ZodObject || shape instanceof ZodEffects) {
		shape =
			shape instanceof ZodObject
				? shape.shape
				: shape instanceof ZodEffects
					? shape._def.schema
					: null;
		if (shape === null) {
			throw new Error(`Could not find shape for key ${key}`);
		}
	}

	if (key.includes(".")) {
		let [parentProp, ...rest] = key.split(".");
		o[parentProp] = o[parentProp] ?? {};
		parseParams(o[parentProp], shape[parentProp], rest.join("."), value);
		return;
	}
	let isArray = false;
	if (key.includes("[]")) {
		isArray = true;
		key = key.replace("[]", "");
	}
	const def = shape[key];
	if (def) {
		processDef(def, o, key, value as string);
	}
}

function processDef(def: ZodTypeAny, o: any, key: string, value: string) {
	let parsedValue: any;
	if (def instanceof ZodString || def instanceof ZodLiteral) {
		parsedValue = value;
	} else if (def instanceof ZodNumber) {
		const num = Number(value);
		parsedValue = isNaN(num) ? value : num;
	} else if (def instanceof ZodDate) {
		const date = Date.parse(value);
		parsedValue = isNaN(date) ? value : new Date(date);
	} else if (def instanceof ZodBoolean) {
		parsedValue =
			value === "true" ? true : value === "false" ? false : Boolean(value);
	} else if (def instanceof ZodNativeEnum || def instanceof ZodEnum) {
		parsedValue = value;
	} else if (def instanceof ZodOptional || def instanceof ZodDefault) {
		// def._def.innerType is the same as ZodOptional's .unwrap(), which unfortunately doesn't exist on ZodDefault
		processDef(def._def.innerType, o, key, value);
		// return here to prevent overwriting the result of the recursive call
		return;
	} else if (def instanceof ZodArray) {
		if (o[key] === undefined) {
			o[key] = [];
		}
		processDef(def.element, o, key, value);
		// return here since recursive call will add to array
		return;
	} else if (def instanceof ZodEffects) {
		processDef(def._def.schema, o, key, value);
		return;
	} else {
		throw new Error(`Unexpected type ${def._def.typeName} for key ${key}`);
	}
	if (Array.isArray(o[key])) {
		o[key].push(parsedValue);
	} else {
		o[key] = parsedValue;
	}
}
