import DateInput from "@/components/DateInput/DateInput";
import { SelectionType } from "@/types";
import {
	FilterOperator,
	filterOperatorSchema,
} from "@/validation/filter-operator-validation";
import { useCallback, useEffect, useState } from "react";
import { SomeZodObject } from "zod";
import DefaultInput from "./DefaultInput";
import DateRange from "./between/dateRange";
import NumberRange from "./between/numberRange";

type Props<T extends SomeZodObject> = React.HTMLAttributes<HTMLDivElement> & {
	onValuesChange: (values: SelectionType[]) => void;
	selectedValues?: SelectionType[];
	schema: T;
	property: string;
	Operator: FilterOperator;
};

function FilterInput<T extends SomeZodObject>({
	onValuesChange,
	selectedValues,
	schema,
	property,
	Operator,
	...rest
}: Props<T>) {
	const [_type, setType] = useState("");

	useEffect(() => {
		const _type = Object.entries(schema.shape).find(
			([key]) => key.toLocaleLowerCase() === property.toLocaleLowerCase(),
		);
		if (!_type || Object.keys(_type).length === 0 || !_type[1]?._def.typeName)
			return;
		setType(_type[1]._def.typeName);
	}, [property, schema.shape]);

	const onValuesSelection = useCallback(
		(values: any[]) => {
			if (Operator === filterOperatorSchema.enum.Between) {
				if (_type === "ZodNumber") {
					onValuesChange(
						values.map(v => ({
							label: v + "",
							value: v + "",
						})),
					);
					return;
				}
				if (_type === "ZodDate") {
					onValuesChange(
						values.map(v => {
							const formattedDate = new Intl.DateTimeFormat("en-GB").format(
								new Date(v),
							);
							return {
								label: formattedDate,
								value: v + "",
							};
						}),
					);
					return;
				}
				return;
			}
			if (
				Operator === filterOperatorSchema.enum.In ||
				Operator === filterOperatorSchema.enum.Not_in
			) {
				return;
			}
			if (_type === "ZodNumber") {
				onValuesChange(
					values.map(v => ({
						label: v + "",
						value: v + "",
					})),
				);
				return;
			}
			if (_type === "ZodDate") {
				onValuesChange(
					values.map(v => {
						const formattedDate = new Intl.DateTimeFormat("en-GB").format(
							new Date(v),
						);
						return {
							label: formattedDate,
							value: v + "",
						};
					}),
				);
				return;
			}
			onValuesChange(
				values.map(v => ({
					label: v,
					value: v,
				})),
			);
		},
		[Operator, _type, onValuesChange],
	);

	return (
		<div {...rest}>
			{_type === "ZodDate" && (
				<>
					{Operator === filterOperatorSchema.enum.Between ||
					Operator === filterOperatorSchema.enum.Not_Between ? (
						<DateRange
							inputValue={
								selectedValues
									? selectedValues.map(v => new Date(v.value))
									: undefined
							}
							onValueChange={v => {
								if (!v || v.length !== 2) return;
								onValuesSelection(v);
							}}
						/>
					) : (
						<DateInput
							SelectedDate={
								selectedValues && selectedValues.length === 1
									? new Date(selectedValues[0].value)
									: undefined
							}
							onDateSelected={d => onValuesSelection(d ? [d] : [])}
						/>
					)}
				</>
			)}
			{_type === "ZodNumber" && (
				<>
					{Operator === filterOperatorSchema.enum.Between ||
					Operator === filterOperatorSchema.enum.Not_Between ? (
						<NumberRange
							inputValue={
								selectedValues
									? selectedValues.map(v => Number(v.value))
									: undefined
							}
							onValueChange={v => {
								if (!v || v.length !== 2) return;
								onValuesSelection(v);
							}}
						/>
					) : (
						<DefaultInput
							inputValue={
								selectedValues && selectedValues.length === 1
									? selectedValues[0].value
									: undefined
							}
							onValueChange={i => onValuesSelection(i ? [i] : [])}
						/>
					)}
				</>
			)}

			{_type === "ZodString" && (
				<DefaultInput
					inputValue={
						selectedValues && selectedValues.length === 1
							? selectedValues[0].value
							: undefined
					}
					onValueChange={i => {
						onValuesSelection(i ? [i] : []);
					}}
				/>
			)}

			{/* {componentToShow === FilterValueSelect.enum.LIST && (
				<MultiSelectInput
					options={options}
					onValuesChange={vs => setValues(vs)}
					values={values as BasicValues | undefined}
				/>
			)} */}
		</div>
	);
}

export default FilterInput;
