import { isArray } from "@/lib/utils/array";
import {
	BasicValues,
	EmployeeFilterOperation,
	FilterOption,
	FilterValueSelect,
} from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { z } from "zod";
import { FilterComparison } from "./comparisonSelections/selections/comparisonSelections/comparisonSchema";

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

const Operation = (
	valueA: string | number | Date | object,
	{ valueB, operation, valueC }: EmployeeFilterOperation,
) => {
	let firstValue: string;
	let secondValue: BasicValues;
	let thirdValue: string | undefined;

	if (valueC) thirdValue = valueC as string;

	if (isArray(valueB)) {
		secondValue = Array.from(valueB as any[]).map(v =>
			String(v).toLocaleLowerCase(),
		);
	} else {
		secondValue = valueB.toString().toLocaleLowerCase();
	}

	// Get First Input Type

	if (Object.prototype.toString.call(valueA) === "[object Date]") {
		firstValue = new Date(valueA as Date).getTime().toString();
	} else if (typeof valueA === "object") {
		firstValue = Object.entries(valueA).map(([_, value]) =>
			value.toString().toLocaleLowerCase(),
		)[1];
	} else {
		firstValue = valueA.toString().toLocaleLowerCase();
	}
	// Return Comparison Expression
	switch (operation) {
		case FilterComparison.Enum.Equal:
			return firstValue === secondValue;

		case FilterComparison.Enum["Not-Equal"]:
			return firstValue !== secondValue;

		case FilterComparison.Enum.GreaterThan:
			return +firstValue > +secondValue;

		case FilterComparison.Enum["GreaterThan-Or-Equal"]:
			return +firstValue >= +secondValue;

		case FilterComparison.Enum.LessThan:
			return +firstValue < +secondValue;

		case FilterComparison.Enum["LessThan-Or-Equal"]:
			return +firstValue <= +secondValue;

		case FilterComparison.Enum.InList:
			return (secondValue as string[]).some(y => y === (firstValue as string));

		case FilterComparison.Enum["Not-InList"]:
			return (secondValue as string[]).every(y => y !== (firstValue as string));

		case FilterComparison.Enum.Include:
			// console.log("🚀 ~ firstValue:", firstValue);

			return firstValue.toString().includes(secondValue.toString());

		case FilterComparison.Enum["Not-Include"]:
			return !firstValue.toString().includes(secondValue.toString());

		case FilterComparison.Enum.Between:
			if (thirdValue) {
				const dd = +firstValue >= +secondValue && +firstValue <= +thirdValue;
				return dd;
			}
			break;
		case FilterComparison.Enum["Not-Between"]:
			if (thirdValue) {
				return +firstValue < +secondValue || +firstValue > +thirdValue;
			}
			break;

		default:
			break;
	}
};

export const getType = (value: keyof z.infer<typeof Employee>) => {
	return Object.values(Employee.shape[value]._def.typeName)
		.toSpliced(0, 3)
		.join("")
		.toLocaleLowerCase();
};
export const setComparisonComponentType = (
	property: keyof Employee,
	operation: FilterComparison,
): FilterValueSelect => {
	const _type = getType(property);
	// console.log("🚀 ~ _type:", _type);
	let comparisonsList: FilterOption[] = [];
	switch (_type) {
		case "number": {
			if (
				operation === FilterComparison.enum.InList ||
				operation === FilterComparison.enum["Not-InList"]
			) {
				return FilterValueSelect.Enum.LIST;
			} else if (
				operation === FilterComparison.enum.Between ||
				operation === FilterComparison.enum["Not-Between"]
			) {
				return FilterValueSelect.Enum.RANGE;
			}
			return FilterValueSelect.Enum.TEXT;
		}
		case "string": {
			return FilterValueSelect.Enum.TEXT;
		}
		case "date": {
			if (
				operation === FilterComparison.enum.Between ||
				operation === FilterComparison.enum["Not-Between"]
			) {
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
const constructOperation = (
	filter: EmployeeFilter,
): EmployeeFilterOperation => {
	let result: EmployeeFilterOperation;

	if (
		filter.operation === FilterComparison.Values.Between ||
		filter.operation === FilterComparison.Values["Not-Between"]
	) {
		const [value1, value2] = filter.data.toString().split(",");
		result = {
			valueB: value1,
			valueC: value2,
			operation: filter.operation,
		};
	} else if (
		filter.operation === FilterComparison.Values.InList ||
		filter.operation === FilterComparison.Values["Not-InList"] ||
		filter.operation === FilterComparison.Values.Include ||
		filter.operation === FilterComparison.Values["Not-Include"]
	) {
		if (filter.property === "position" || filter.property === "salaryStatus") {
			result = {
				valueB: filter.data,
				// valueB: (filter.data as FilterOption[]).map(e => e.value),
				operation: filter.operation,
			};
		} else {
			result = {
				valueB: filter.data,
				// valueB: filter.data.toString().split(","),
				operation: filter.operation,
			};
		}
	} else {
		result = {
			valueB: filter.data,
			valueC: undefined,
			operation: filter.operation,
		};
	}

	return result;
};

export const getFilteredResult = ({
	employees,
	filters,
}: {
	employees: Employee[];
	filters: EmployeeFilter[];
}): Employee[] => {
	return employees.filter(x => {
		return filters.every(f => {
			const data = constructOperation(f);
			return Operation(x[f.property] as string | number | Date | object, {
				valueB: data.valueB,
				valueC: data.valueC,
				operation: data.operation,
			});
		});
	});
};
