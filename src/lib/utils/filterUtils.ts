import { BasicValues, FilterOption } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { enumToLabelKeyValues, isArray } from "./array";

export const generateLabelValueEmployeesList = (
	employeesList: Employee[],
	property: keyof Employee,
): FilterOption[] => {
	const list = employeesList.map(e => e[property]);
	return enumToLabelKeyValues(list);
};

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

export const searchParamsToFilter = (
	searchParams: string,
): EmployeeFilter[] => {
	const result: EmployeeFilter[] = [];
	const filtersList = searchParams.split(",");
	const resulted = filtersList.forEach(l => {
		const filters = l.split("_");
		if (filters.length !== 3) return;
		const [property, operation, data] = filters;
		const dataList = data.split("*");
		const validate = EmployeeFilter.safeParse({
			property,
			operation,
			data: dataList.length === 1 ? dataList[0] : dataList,
		});

		if (validate.success) {
			result.push(validate.data);
		} else {
		}
	});
	return result;
};
export const getReadableFilterValues = (
	filter: EmployeeFilter,
	employees: Employee[],
): EmployeeFilter => {
	if (filter.operation === "InList" || filter.operation === "Not_InList") {
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
				data: (filter.data as string[]).map(l =>
					new Intl.DateTimeFormat("en-GB").format(new Date(l)),
				),
			};
		} else {
			filter = {
				...filter,
				data: new Intl.DateTimeFormat("en-GB").format(filter.data as Date),
			};
		}
	}
	return filter;
};
