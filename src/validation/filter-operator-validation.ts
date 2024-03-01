import { z } from "zod";

export enum BasicOperator {
	Equal = "eq",
	Not_Equal = "ne",
}
export enum BooleanOperator {
	True = "true",
	False = "false",
}
export enum StringOperator {
	Endswith = "endswith",
	Startswith = "startswith",
	Contains = "contains",
}
export enum ComparisonOperator {
	Greater_Than = "gt",
	Greater_Than_Or_Equal = "ge",
	Less_Than = "lt",
	Less_Than_Or_Equal = "le",
	Between = "bt",
	Not_Between = "nbt",
}
export enum ListOperator {
	In = "in",
	Not_in = "not in",
}
export enum ComparisonLogic {
	Not = "not",
	Or = "or",
	And = "and",
}

//To Show FilterValue Component
export const filterOperatorSchema = z.nativeEnum({
	...BasicOperator,
	...BooleanOperator,
	...StringOperator,
	...ComparisonOperator,
	...ListOperator,
	...ComparisonLogic,
});

export type FilterOperator = z.infer<typeof filterOperatorSchema>;
