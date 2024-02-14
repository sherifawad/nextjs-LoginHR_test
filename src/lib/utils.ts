import { FilterOption, dateInput } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnumValues } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getSalaryStatusName = (s: EnumValues) => {
	const names: string[] = [];
	for (var n in s) {
		if (typeof s[n] === "number") names.push(n);
	}
	return names;
};

export const ConvertToArabicNumbers = (num: number) => {
	const arabicNumbers =
		"\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
	return new String(num).replace(/[0123456789]/g, d => {
		return arabicNumbers[d as any];
	});
};

export const ConvertToLocalDateString = (input: dateInput) => {
	const weeks = input.week;
	if (weeks === 31) {
		const lastDateOfTheMonth = new Date(
			input.year,
			input.month + 1,
			0,
		).getDate();

		return new Date(
			input.year,
			input.month,
			lastDateOfTheMonth,
		).toLocaleDateString();
	}
	return new Date(input.year, input.month, input.week).toLocaleDateString();
};
export const ConvertToISODateString = (input: dateInput) => {
	const weeks = input.week;
	if (weeks === 31) {
		const lastDateOfTheMonth = new Date(
			input.year,
			input.month + 1,
			0,
		).getDate();

		return new Date(input.year, input.month, lastDateOfTheMonth).toISOString();
	}
	return new Date(input.year, input.month, input.week).toISOString();
};
export const ConvertToDate = (inputDateString: string) => {
	var parts = inputDateString.split("/");
	// Please pay attention to the month (parts[1]); JavaScript counts months from 0:
	// January - 0, February - 1, etc.
	return new Date(+parts[2], +parts[1] - 1, +parts[0] + 1);
};

export const stringTrim = (str: string): string =>
	str.replace(/\s\s+/g, " ").trim();

export const isArray = function (a: unknown) {
	return Array.isArray(a);
};

export const isObject = function (o: unknown) {
	return o === Object(o) && !isArray(o) && typeof o !== "function";
};

export function isIterable(variable: unknown) {
	return isArray(variable) || isObject(variable);
}

export function serialize(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export const getEnumName = (key: string, enumValue: any) => {
	const valid = isIterable(enumValue);
	let value = undefined;
	if (valid) {
		for (var n in enumValue) {
			if (enumValue[n] === key) {
				value = n;
				break;
			}
		}
	}
	return value;
};

const keyValuePair = (obj: Object) => {
	return Object.entries(obj).map(entry => entry);
};
const objectToValueLabel = (obj: Object) => {
	const result: FilterOption[] = [];
	for (let n in obj) {
		if (isNaN(n as unknown as number)) {
			result.push({
				label: n,
				value: (obj as any)[n],
			});
		}
	}
	return result;
};

export const iterate = (obj: any) => {
	const result: FilterOption[] = [];
	Object.keys(obj).forEach(key => {
		const value = obj[key];

		if (typeof value === "object" && value !== null) {
			const newArray: any[] = [];
			Object.keys(value).forEach(nestedKey => {
				const nestedValue = value[nestedKey];
				if (typeof nestedValue === "object" && nestedValue !== null) {
					iterate(nestedValue);
				} else {
					newArray.push(nestedValue);
				}
			});
			result.push({
				label: newArray[0],
				value: newArray[1],
			});
		} else {
			if (isNaN(key as unknown as number)) {
				result.push({
					label: key,
					value,
				});
			} else if (isNaN(value as unknown as number)) {
				result.push({
					label: value,
					value,
				});
			}
		}
	});
	return result.filter(
		({ label }, index) => index === result.findIndex(x => x.label === label),
	);
};

export const enumToLabelKeyValues = (value: any) => {
	let result: FilterOption[] = [];
	const iterable = isIterable(value);
	if (!iterable) return result;
	result = iterate(value);

	return result;
};
