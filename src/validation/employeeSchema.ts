import {
	isArray,
	isArrayDate,
	isArrayNumber,
	isArrayString,
} from "@/lib/utils/array";
import { BasicValues } from "@/types";
import { z } from "zod";
import { FilterComparison } from "../components/filters/comparisonSelections/selections/comparisonSelections/comparisonSchema";

enum SalaryStatus {
	VALID,
	NOT_VALID,
}

export const SalaryStatusEnum = z.nativeEnum(SalaryStatus);

export const EmployeePosition = z.object({
	positionName: z.string().min(1),
	positionCode: z.coerce.number().int().min(1).positive(),
});

export const Employee = z.object({
	code: z.coerce.number(),
	name: z.string().min(5),
	salaryStatus: SalaryStatusEnum,
	hiringDate: z.coerce.date(),
	positionCode: z.coerce.number().nullable(),
	position: EmployeePosition.nullable(),
});

export const EmployeeFilter = z
	.object({
		property: z.custom<keyof Employee>(),
		operation: FilterComparison,
		data: BasicValues,
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

export type EmployeePosition = z.infer<typeof EmployeePosition>;

export type Employee = z.infer<typeof Employee>;
