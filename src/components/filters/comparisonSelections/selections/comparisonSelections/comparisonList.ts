import { Employee } from "@/validation/employeeSchema";
import { z } from "zod";
import { getType } from "../../../constants";
import { FilterComparison } from "./comparisonSchema";

export const FilterComparisonOption = z.object({
	label: FilterComparison,
	value: FilterComparison,
});

export type FilterComparisonOption = z.infer<typeof FilterComparisonOption>;

const FavoriteComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum.GreaterThan,
		value: FilterComparison.Values.GreaterThan,
	},
	{
		label: FilterComparison.enum.LessThan,
		value: FilterComparison.Values.LessThan,
	},

	{
		label: FilterComparison.enum["GreaterThan-Or-Equal"],
		value: FilterComparison.Values["GreaterThan-Or-Equal"],
	},
	{
		label: FilterComparison.enum["LessThan-Or-Equal"],
		value: FilterComparison.Values["LessThan-Or-Equal"],
	},
];

const BlankComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum.IsBlank,
		value: FilterComparison.Values.IsBlank,
	},
	{
		label: FilterComparison.enum["Is-Not-Blank"],
		value: FilterComparison.Values["Is-Not-Blank"],
	},
];
const NullComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum["Is-Null"],
		value: FilterComparison.Values["Is-Null"],
	},
	{
		label: FilterComparison.enum["Is-Not-Null"],
		value: FilterComparison.Values["Is-Not-Null"],
	},
];
const BetweenComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Between,
		value: FilterComparison.Values.Between,
	},
	{
		label: FilterComparison.enum["Not-Between"],
		value: FilterComparison.Values["Not-Between"],
	},
];
const IncludeComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum.Include,
		value: FilterComparison.Values.Include,
	},
	{
		label: FilterComparison.enum["Not-Include"],
		value: FilterComparison.Values["Not-Include"],
	},
];

const EqualComparison: FilterComparisonOption[] = [
	{ label: FilterComparison.enum.Equal, value: FilterComparison.Values.Equal },
	{
		label: FilterComparison.enum["Not-Equal"],
		value: FilterComparison.Values["Not-Equal"],
	},
];
const ListComparison: FilterComparisonOption[] = [
	{
		label: FilterComparison.enum.InList,
		value: FilterComparison.Values.InList,
	},
	{
		label: FilterComparison.enum["Not-InList"],
		value: FilterComparison.Values["Not-InList"],
	},
];

export const getComparisonList = (property: keyof Employee) => {
	const _type = getType(property);
	// console.log("🚀 ~ getComparisonList ~ _type:", _type);
	let comparisonsList: FilterComparisonOption[] = [];
	if (_type === "number" || _type === "nullable") {
		if (property === "position") {
			comparisonsList = ListComparison;
		} else {
			comparisonsList = [
				...EqualComparison,
				...FavoriteComparison,
				...IncludeComparison,
				...BetweenComparison,
			];
		}
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
