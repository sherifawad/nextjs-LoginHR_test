import { z } from "zod";

//To Show FilterValue Component
export const FilterComparison = z.enum([
	"GreaterThan",
	"LessThan",
	"Equal",
	"Not_Equal",
	"GreaterThan_Or_Equal",
	"LessThan_Or_Equal",
	"Between",
	"Not_Between",
	"InList",
	"Not_InList",
	"Include",
	"Not_Include",
	"IsBlank",
	"Is_Not_Blank",
	"Is_Null",
	"Is_Not_Null",
]);

export type FilterComparison = z.infer<typeof FilterComparison>;
