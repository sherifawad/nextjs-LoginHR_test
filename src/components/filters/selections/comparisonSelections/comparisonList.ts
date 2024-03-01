import { enumToLabelKeyValues } from "@/lib/utils/array";
import {
	BasicOperator,
	BooleanOperator,
	ComparisonOperator,
	ListOperator,
	StringOperator,
} from "@/validation/filter-operator-validation";

export const getOperatorEnums = (_type: string) => {
	// console.log("🚀 ~ getComparisonList ~ _type:", _type);
	if (_type === "ZodNumber" || _type === "ZodDate") {
		return { ...BasicOperator, ...ComparisonOperator };
	}
	if (_type === "ZodString") {
		return { ...BasicOperator, ...StringOperator };
	}
	if (_type === "ZodBoolean") {
		return BooleanOperator;
	}
	if (_type === "ZodUndefined" || _type === "ZodNull") {
		return BasicOperator;
	}
	return ListOperator;
};
export const getComparisonList = (_type: string) => {
	const enums = getOperatorEnums(_type);
	return enumToLabelKeyValues(enums);
};
