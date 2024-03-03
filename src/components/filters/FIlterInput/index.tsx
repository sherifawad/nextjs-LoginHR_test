import DateInput from "@/components/DateInput/DateInput";
import useFilterValuesOutput from "@/hooks/useFilterValuesOutput";
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
	onValuesChange: (values: any[]) => void;
	selectedValues?: any[];
	schema: T;
	property: string;
	Operator: FilterOperator;
	keyLabel?: boolean;
};

function FilterInput<T extends SomeZodObject>({
	onValuesChange,
	selectedValues,
	schema,
	property,
	Operator,
	keyLabel = false,
	...rest
}: Props<T>) {
	const [value, setValue] = useState<any[] | undefined>(selectedValues);

	const [_type, setType] = useState("");

	const { onSelection } = useFilterValuesOutput({ keyLabel });

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
			setValue(values);
			onValuesChange(onSelection({ _type, Operator, values }));
		},
		[Operator, _type, onSelection, onValuesChange],
	);

	return (
		<div {...rest}>
			{_type === "ZodDate" && (
				<>
					{Operator === filterOperatorSchema.enum.Between ||
					Operator === filterOperatorSchema.enum.Not_Between ? (
						<DateRange
							inputValue={
								value ? value.map(v => new Date(String(v))) : undefined
							}
							onValueChange={v => {
								if (!v || v.length !== 2) return;
								onValuesSelection(v);
							}}
						/>
					) : (
						<DateInput
							SelectedDate={
								value && value.length === 1
									? new Date(String(value[0]))
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
							inputValue={value ? value.map(v => Number(v)) : undefined}
							onValueChange={v => {
								if (!v || v.length !== 2) return;
								onValuesSelection(v);
							}}
						/>
					) : (
						<DefaultInput
							inputValue={
								value && value.length === 1 ? String(value[0]) : undefined
							}
							onValueChange={i => onValuesSelection(i ? [i] : [])}
						/>
					)}
				</>
			)}

			{_type === "ZodString" && (
				<DefaultInput
					inputValue={
						value && value.length === 1 ? String(value[0]) : undefined
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
