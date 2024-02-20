import { isArray, isArrayDate, isArrayString } from "@/lib/utils/array";
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
			// console.log("🚀 ~ data:", data);
			if (data.operation === "Between" || data.operation === "Not-Between") {
				// console.log("1️⃣");
				if (isArray(data.data)) {
					// console.log("1️⃣  2️⃣");
					if (data.property === "hiringDate") {
						// console.log("1️⃣  3️⃣");
						return isArrayDate(data.data);
					} else if (data.property == "code") {
						// console.log("1️⃣  4️⃣");
						return isArrayString(data.data);
					}
					// console.log("1️⃣  5️⃣");
					return true;
				}
				// console.log("1️⃣  6️⃣");
				return false;
			}
			if (data.operation === "InList" || data.operation === "Not-InList") {
				// console.log("1️⃣  7️⃣");
				if (isArray(data.data)) {
					// console.log("1️⃣  8️⃣");

					if (data.property === "hiringDate") {
						// console.log("1️⃣  9️⃣");

						return isArrayDate(data.data);
					} else {
						// console.log("1️⃣   🔟");

						return isArrayString(data.data);
					}
				}
				// console.log("1️⃣  1️⃣  1️⃣");

				return false;
			}
			if (data.property === "hiringDate") {
				// console.log("2️⃣  1️⃣");
				const result =
					Object.prototype.toString.call(new Date(+data.data)) ===
					"[object Date]";
				// console.log("🚀 ~ result:", result);
				return result;
			}
			if (data.property === "position" || data.property == "salaryStatus") {
				// console.log("3️⃣  1️⃣");

				return isArrayString(data.data);
			}
			// console.log("4️⃣   1️⃣");

			// console.log("🚀 ~ typeof data.data:", typeof data.data);
			// console.log("🚀 ~ schema data.data:::::::::::::", data.data);
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
