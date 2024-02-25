import { z } from "zod";

//To Show FilterValue Component
export const FilterComparison = z.enum([
	"GreaterThan",
	"LessThan",
	"Equal",
	"Not-Equal",
	"GreaterThan-Or-Equal",
	"LessThan-Or-Equal",
	"Between",
	"Not-Between",
	"InList",
	"Not-InList",
	"Include",
	"Not-Include",
	"IsBlank",
	"Is-Not-Blank",
	"Is-Null",
	"Is-Not-Null",
]);

export type FilterComparison = z.infer<typeof FilterComparison>;
