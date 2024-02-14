import { isArray, isArrayDate, isArrayString } from "@/lib/utils/array";
import { BasicValues } from "@/types";
import { z } from "zod";
import { FilterComparison } from "./comparisonSnema";

export const SalaryStatusEnum = z.enum(["VALID", "NOT_VALID"]);

export const EmployeePosition = z.object({
	positionName: z.string().min(1),
	positionCode: z.coerce.number().int().min(1).positive(),
});

export const Employee = z.object({
	code: z.coerce.number(),
	name: z.string().min(5),
	salaryStatus: SalaryStatusEnum,
	hiringDate: z.date(),
	position: EmployeePosition,
});

export const EmployeeFilter = z
	.object({
		property: z.custom<keyof Employee>(),
		operation: FilterComparison,
		data: BasicValues,
	})
	.refine(
		data => {
			if (data.operation === "Between" || data.operation === "Not_Between") {
				if (isArray(data.data)) {
					if (data.property === "hiringDate") {
						return isArrayDate(data.data);
					} else if (data.property == "code") {
						return isArrayString(data.data);
					}
				}
				return false;
			}
			if (data.property === "hiringDate") {
				return Object.prototype.toString.call(data.data) === "[object Date]";
			}
			if (data.property === "position" || data.property == "salaryStatus") {
				return isArrayString(data.data);
			}
			return typeof data.data === "string";
		},
		{
			path: ["data"],
		},
	);

export type EmployeeFilter = z.infer<typeof EmployeeFilter>;
export type SalaryStatusEnum = z.infer<typeof SalaryStatusEnum>;

export type EmployeePosition = z.infer<typeof EmployeePosition>;

export type Employee = z.infer<typeof Employee>;
