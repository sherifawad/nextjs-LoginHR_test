import { SelectionType } from "@/types";

export const isArray = function (a: unknown) {
	return Array.isArray(a);
};

export const isObject = function (o: unknown) {
	return o === Object(o) && !isArray(o) && typeof o !== "function";
};

export function isIterable(variable: unknown) {
	return isArray(variable) || isObject(variable);
}

export const splitStringToArray = (value: string, separator: string = " ") => {
	if (value === "undefined" || value === "null") return [];
	return value.split(separator);
};

export const isArrayString = (value: any): boolean => {
	// console.log("🚀 ~ isArrayString ~ value:", value);
	if (!isIterable(value)) return false;
	if (!isArray(value)) return false;
	value.forEach(function (item: any) {
		if (typeof item !== "string" || item.length > 0) {
			return false;
		}
	});
	return true;
};
export const isArrayNumber = (value: any): boolean => {
	// console.log("🚀 ~ isArrayNumber ~ value:", value);
	if (!isIterable(value)) return false;
	if (!isArray(value)) return false;
	value.forEach(function (item: any) {
		if (typeof item !== "number" || isNaN(Number(value))) {
			return false;
		}
	});
	return true;
};
export const isArrayDate = (value: any): boolean => {
	if (!isIterable(value)) return false;
	if (!isArray(value)) return false;
	try {
		return (value as string[]).every(
			v => Object.prototype.toString.call(new Date(+v)) === "[object Date]",
		);
	} catch (error) {
		console.log("🚀 ~ isArrayDate ~ error:", error);
		return false;
	}
};

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

export const iterate = (obj: any) => {
	const result: SelectionType[] = [];
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
	return result;
};

export const enumToLabelKeyValues = (value: any): SelectionType[] => {
	let result: SelectionType[] = [];
	const iterable = isIterable(value);
	if (!iterable) return result;
	result = iterate(value);

	return result.filter(
		({ label }, index) => index === result.findIndex(x => x.label === label),
	);
};
