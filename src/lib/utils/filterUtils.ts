import { FilterOption } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { enumToLabelKeyValues } from "./array";

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
