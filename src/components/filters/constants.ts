import { isArray } from "@/lib/utils/array";
import {
	BasicValues,
	EmployeeFilterComparisonOption,
	EmployeeFilterOperation,
	Filter,
	FilterOption,
	FilterValueSelect,
} from "@/types";
import { FilterComparison } from "@/validation/comparisonSnema";
import { Employee } from "@/validation/employeeSchema";
import { z } from "zod";

export const NumberOps = {
	//for operator
	eq: (a: number, b: number) => a === b, //equal
	neq: (a: number, b: number) => a !== b, //not equal,
	con: (a: number[], b: number) => a.includes(b), //contain
	inc: (a: number, b: number) => a.toString().includes(b.toString()), //include
	gt: (a: number, b: number) => a > b, //greater than
	lt: (a: number, b: number) => a < b, //lower than
	gteq: (a: number, b: number) => a >= b,
	lteq: (a: number, b: number) => a <= b,
	betw: (a: number, b: number, c: number) => a >= b || a <= c,
} as const;
export const DateOps = {
	//for operator
	eq: (a: Date, b: Date) => a.getTime() === b.getTime(), //equal
	neq: (a: Date, b: Date) => a.getTime() !== b.getTime(), //not equal,
	gt: (a: Date, b: Date) => a.getTime() > b.getTime(), //greater than
	lt: (a: Date, b: Date) => a.getTime() < b.getTime(), //lower than
	gteq: (a: Date, b: Date) => a.getTime() >= b.getTime(),
	lteq: (a: Date, b: Date) => a.getTime() <= b.getTime(),
	betw: (a: Date, b: Date, c: Date) =>
		a.getTime() >= b.getTime() || a.getTime() <= c.getTime(),
} as const;
export const StringOps = {
	//for operator
	eq: (a: string, b: string) => a.toLowerCase() === b.toLowerCase(), //equal
	neq: (a: string, b: string) => a.toLowerCase() !== b.toLowerCase(), //not equal,
	inc: (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase()), //include
	con: (a: string[], b: string) =>
		a.map(x => x.toLowerCase()).includes(b.toLowerCase()), //contain
} as const;

export const Operation = (
	valueA: BasicValues,
	{ valueB, operation, valueC }: EmployeeFilterOperation,
) => {
	let firstValue: string | number | Date | string[] | number[] | undefined;
	let secondValue: string | number | Date | string[] | number[] | undefined;
	let thirdValue: string | number | Date | undefined;

	secondValue = String(valueB).toLocaleLowerCase();

	if (isArray(valueB)) {
		secondValue = Array.from(valueB as any[]).map(v =>
			String(v).toLocaleLowerCase(),
		);
	}
	if (valueC) thirdValue = String(valueB).toLocaleLowerCase();

	// Set Input Types
	if (typeof valueA === "object") {
		firstValue = Object.entries(valueA).map(([_, value]) =>
			value.toString().toLocaleLowerCase(),
		)[1];
	} else if (Object.prototype.toString.call(valueA) === "[object Date]") {
		firstValue = (valueA as unknown as Date).getTime();
		secondValue = (valueB as Date).getTime();
		if (valueC) thirdValue = (valueC as Date).getTime();
	} else {
		firstValue = String(valueA).toLocaleLowerCase();
	}

	// Return Comparison Expression
	switch (operation) {
		case FilterComparison.Enum.Equal:
			return firstValue === secondValue;
		case FilterComparison.Enum.Not_Equal:
			return firstValue !== secondValue;
		case FilterComparison.Enum.GreaterThan:
			if (firstValue && secondValue) {
				return firstValue > secondValue;
			}
			break;
		case FilterComparison.Enum.GreaterThan_Or_Equal:
			if (firstValue && secondValue) {
				return firstValue >= secondValue;
			}
			break;
		case FilterComparison.Enum.LessThan:
			if (firstValue && secondValue) {
				return firstValue < secondValue;
			}
			break;
		case FilterComparison.Enum.LessThan_Or_Equal:
			if (firstValue && secondValue) {
				return firstValue <= secondValue;
			}
			break;
		case FilterComparison.Enum.InList:
			if (firstValue && secondValue && isArray(secondValue)) {
				// return (secondValue as string[]).filter(e => e !== firstValue);
				return (secondValue as string[]).some(
					y => y === (firstValue as string),
				);
			}
			break;
		case FilterComparison.Enum.Not_InList:
			if (firstValue && secondValue && isArray(secondValue)) {
				return (secondValue as string[]).every(
					y => y !== (firstValue as string),
				);
			}
			break;

		case FilterComparison.Enum.Include:
			if (firstValue && secondValue) {
				return firstValue.toString().includes(secondValue.toString());
			}
			break;
		case FilterComparison.Enum.Not_Include:
			if (firstValue && secondValue) {
				return !firstValue.toString().includes(secondValue.toString());
			}
			break;
		case FilterComparison.Enum.Between:
			if (firstValue && secondValue && thirdValue) {
				return firstValue >= secondValue && firstValue <= thirdValue;
			}
			break;
		case FilterComparison.Enum.Not_Between:
			if (firstValue && secondValue && thirdValue) {
				return firstValue < secondValue || firstValue > thirdValue;
			}
			break;

		default:
			break;
	}
};

const FavoriteComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.GreaterThan,
		value: FilterComparison.Values.GreaterThan,
	},
	{
		label: FilterComparison.enum.LessThan,
		value: FilterComparison.Values.LessThan,
	},

	{
		label: FilterComparison.enum.GreaterThan_Or_Equal,
		value: FilterComparison.Values.GreaterThan_Or_Equal,
	},
	{
		label: FilterComparison.enum.LessThan_Or_Equal,
		value: FilterComparison.Values.LessThan_Or_Equal,
	},
];

const BlankComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.IsBlank,
		value: FilterComparison.Values.IsBlank,
	},
	{
		label: FilterComparison.enum.Is_Not_Blank,
		value: FilterComparison.Values.Is_Not_Blank,
	},
];
const NullComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Is_Null,
		value: FilterComparison.Values.Is_Null,
	},
	{
		label: FilterComparison.enum.Is_Not_Null,
		value: FilterComparison.Values.Is_Not_Null,
	},
];
const BetweenComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Between,
		value: FilterComparison.Values.Between,
	},
	{
		label: FilterComparison.enum.Not_Between,
		value: FilterComparison.Values.Not_Between,
	},
];
const IncludeComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Include,
		value: FilterComparison.Values.Include,
	},
	{
		label: FilterComparison.enum.Not_Include,
		value: FilterComparison.Values.Not_Include,
	},
];

const EqualComparison: EmployeeFilterComparisonOption[] = [
	{ label: FilterComparison.enum.Equal, value: FilterComparison.Values.Equal },
	{
		label: FilterComparison.enum.Not_Equal,
		value: FilterComparison.Values.Not_Equal,
	},
];
const ListComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.InList,
		value: FilterComparison.Values.InList,
	},
	{
		label: FilterComparison.enum.Not_InList,
		value: FilterComparison.Values.Not_InList,
	},
];

export const PropertiesLabels: FilterOption[] = Object.keys(Employee.shape).map(
	e => ({
		label: e,
		value: e,
	}),
);
export const getType = (value: keyof z.infer<typeof Employee>) => {
	return Object.values(Employee.shape[value]._def.typeName)
		.toSpliced(0, 3)
		.join("")
		.toLocaleLowerCase();
};

export const getComparisonList = (property: keyof z.infer<typeof Employee>) => {
	const _type = getType(property);
	console.log("🚀 ~ getComparisonList ~ _type:", _type);
	let comparisonsList: EmployeeFilterComparisonOption[] = [];
	if (_type === "number") {
		comparisonsList = [
			...EqualComparison,
			...FavoriteComparison,
			...IncludeComparison,
			...BetweenComparison,
		];
	} else if (_type === "string") {
		comparisonsList = [...EqualComparison, ...IncludeComparison];
	} else if (_type === "date") {
		comparisonsList = [
			...EqualComparison,
			...FavoriteComparison,
			...BetweenComparison,
		];
	} else if (_type === "object" || _type === "enum" || _type === "nativeenum") {
		comparisonsList = ListComparison;
	} else {
		comparisonsList = [...IncludeComparison, ...ListComparison];
	}
	return comparisonsList;
};

export const setComparisonComponentType = (
	property: keyof z.infer<typeof Employee>,
	operation: FilterComparison,
): FilterValueSelect => {
	const _type = getType(property);
	console.log("🚀 ~ _type:", _type);
	let comparisonsList: FilterOption[] = [];
	switch (_type) {
		case "number": {
			if (
				operation === FilterComparison.enum.InList ||
				operation === FilterComparison.enum.Not_InList
			) {
				return FilterValueSelect.Enum.LIST;
			} else if (
				operation === FilterComparison.enum.Between ||
				operation === FilterComparison.enum.Not_Between
			) {
				return FilterValueSelect.Enum.RANGE;
			}
			return FilterValueSelect.Enum.TEXT;
		}
		case "string": {
			return FilterValueSelect.Enum.TEXT;
		}
		case "date": {
			if (operation === FilterComparison.enum.Between) {
				return FilterValueSelect.Enum.DATE_RANGE;
			}
			return FilterValueSelect.Enum.DATE;
		}
		case "object":
		case "nativeenum":
		case "enum": {
			return FilterValueSelect.Enum.LIST;
		}

		default:
			return FilterValueSelect.Enum.TEXT;
	}
};

// create operation
export const constructOperation = (
	filter: Filter,
): EmployeeFilterOperation | undefined => {
	const validatedFilter = Filter.safeParse(filter);
	if (!validatedFilter.success) {
		console.log("🚀 ~ addFilter ~ validatedFilter:", validatedFilter.error);
		return undefined;
	}
	let result: EmployeeFilterOperation;
	const validatedOperation = FilterComparison.safeParse(
		validatedFilter.data.operation.value,
	);
	if (!validatedOperation.success) {
		console.log(
			"🚀 ~ addFilter ~ validatedOperation:",
			validatedOperation.error,
		);
		return undefined;
	}
	const validatedData = BasicValues.safeParse(validatedFilter.data.data);
	if (!validatedData.success) {
		console.log("🚀 ~ addFilter ~ validatedData:", validatedData.error);
		return undefined;
	}
	console.log("🚀 ~ validatedData:", validatedData.data);

	if (
		validatedFilter.data.operation.value === FilterComparison.Values.Between ||
		validatedFilter.data.operation.value === FilterComparison.Values.Not_Between
	) {
		const [value1, value2] = validatedData.data.toString().split(",");
		result = {
			valueB: value1,
			valueC: value2,
			operation: validatedOperation.data,
		};
	} else if (
		validatedFilter.data.operation.value === FilterComparison.Values.InList ||
		validatedFilter.data.operation.value ===
			FilterComparison.Values.Not_InList ||
		validatedFilter.data.operation.value === FilterComparison.Values.Include ||
		validatedFilter.data.operation.value === FilterComparison.Values.Not_Include
	) {
		if (
			validatedFilter.data.property.value === "position" ||
			validatedFilter.data.property.value === "salaryStatus"
		) {
			result = {
				valueB: filter.data,
				// valueB: (filter.data as FilterOption[]).map(e => e.value),
				operation: validatedOperation.data,
			};
		} else {
			result = {
				valueB: validatedData.data,
				// valueB: validatedData.data.toString().split(","),
				operation: validatedOperation.data,
			};
		}
	} else {
		result = {
			valueB: validatedData.data,
			valueC: undefined,
			operation: validatedOperation.data,
		};
	}

	return result;
};
