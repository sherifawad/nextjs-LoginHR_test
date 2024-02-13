import {
	Employee,
	EmployeeFilterComparisonOption,
	FilterComparison,
	FilterOption,
	FilterValueSelect,
} from "@/types";
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
	betw: (a: number, b: number) => a >= b || a <= b,
} as const;
export const DateOps = {
	//for operator
	eq: (a: Date, b: Date) => a.getTime() === b.getTime(), //equal
	neq: (a: Date, b: Date) => a.getTime() !== b.getTime(), //not equal,
	gt: (a: Date, b: Date) => a.getTime() > b.getTime(), //greater than
	lt: (a: Date, b: Date) => a.getTime() < b.getTime(), //lower than
	gteq: (a: Date, b: Date) => a.getTime() >= b.getTime(),
	lteq: (a: Date, b: Date) => a.getTime() <= b.getTime(),
	betw: (a: Date, b: Date) =>
		a.getTime() >= b.getTime() || a.getTime() <= b.getTime(),
} as const;
export const StringOps = {
	//for operator
	eq: (a: string, b: string) => a.toLowerCase() === b.toLowerCase(), //equal
	neq: (a: string, b: string) => a.toLowerCase() !== b.toLowerCase(), //not equal,
	inc: (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase()), //include
	con: (a: string[], b: string) =>
		a.map(x => x.toLowerCase()).includes(b.toLowerCase()), //contain
} as const;

const FavoriteComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.GreaterThan,
		value: FilterComparison.enum.GreaterThan,
	},
	{
		label: FilterComparison.enum.LessThan,
		value: FilterComparison.enum.LessThan,
	},

	{
		label: FilterComparison.enum.GreaterThan_Or_Equal,
		value: FilterComparison.enum.GreaterThan_Or_Equal,
	},
	{
		label: FilterComparison.enum.LessThan_Or_Equal,
		value: FilterComparison.enum.LessThan_Or_Equal,
	},
];

const ContainComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Contain,
		value: FilterComparison.enum.Contain,
	},
];
const BetweenComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Between,
		value: FilterComparison.enum.Between,
	},
];
const IncludeComparison: EmployeeFilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Include,
		value: FilterComparison.enum.Include,
	},
];

const EqualComparison: EmployeeFilterComparisonOption[] = [
	{ label: FilterComparison.enum.Equal, value: FilterComparison.enum.Equal },
	{
		label: FilterComparison.enum.Not_Equal,
		value: FilterComparison.enum.Not_Equal,
	},
];
const ListComparison: EmployeeFilterComparisonOption[] = [
	{ label: FilterComparison.enum.InList, value: FilterComparison.enum.InList },
	{
		label: FilterComparison.enum.Not_InList,
		value: FilterComparison.enum.Not_InList,
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
	let comparisonsList: EmployeeFilterComparisonOption[] = [];
	if (_type === "number") {
		comparisonsList = [
			...EqualComparison,
			...FavoriteComparison,
			...IncludeComparison,
			...ContainComparison,
			...BetweenComparison,
			...ListComparison,
		];
	} else if (_type === "string") {
		comparisonsList = [
			...EqualComparison,
			...IncludeComparison,
			...ContainComparison,
		];
	} else if (_type === "date") {
		comparisonsList = [
			...EqualComparison,
			...FavoriteComparison,
			...BetweenComparison,
		];
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
	let comparisonsList: FilterOption[] = [];
	switch (_type) {
		case "number": {
			if (
				operation === FilterComparison.enum.Between ||
				operation === FilterComparison.enum.Contain ||
				operation === FilterComparison.enum.InList ||
				operation === FilterComparison.enum.Not_InList
			) {
				return FilterValueSelect.Enum.LIST;
			}
			return FilterValueSelect.Enum.TEXT;
		}
		case "string": {
			if (
				operation === FilterComparison.enum.Contain ||
				operation === FilterComparison.enum.InList ||
				operation === FilterComparison.enum.Not_InList
			) {
				return FilterValueSelect.Enum.LIST;
			}
			return FilterValueSelect.Enum.TEXT;
		}
		case "date": {
			if (operation === FilterComparison.enum.Between) {
				return FilterValueSelect.Enum.DATE_RANGE;
			}
			return FilterValueSelect.Enum.DATE;
		}

		default:
			return FilterValueSelect.Enum.LIST;
	}
};
