import { SelectionType } from "@/types";
import { FilterOperator } from "@/validation/filter-operator-validation";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useCallback, useEffect, useState } from "react";
import { SomeZodObject } from "zod";
import FilterSelect from "../FilterSelect";
import { getComparisonList } from "./comparisonList";

type Props<T extends SomeZodObject> = SelectPrimitive.SelectProps & {
	onSelectionChange: (selection?: {
		label: string;
		value: FilterOperator;
	}) => Promise<void>;
	property?: string;
	selectedValue?: string;
	schema: T;
};

function OperatorSelection<T extends SomeZodObject>({
	onSelectionChange,
	selectedValue,
	property,
	schema,
	...rest
}: Props<T>) {
	const [value, setValue] = useState<SelectionType | null | undefined>(
		undefined,
	);
	const [options, setOptions] = useState<SelectionType[]>([]);

	const onChange = useCallback(
		(selected: SelectionType | undefined) => {
			setValue(selected);
			onSelectionChange(
				selected?.value
					? { label: selected.label, value: selected.value as FilterOperator }
					: undefined,
			);
		},
		[onSelectionChange],
	);

	useEffect(() => {
		if (!property || !schema) return;

		const _type = Object.entries(schema.shape).find(
			([key]) => key.toLocaleLowerCase() === property.toLocaleLowerCase(),
		);
		if (!_type) return;

		setOptions(getComparisonList(_type[1]._def.typeName));
	}, [schema, property]);

	useEffect(() => {
		if (!options || options.length < 1) return;
		if (!selectedValue) return;
		const selected = options.find(
			o => o.value.toLocaleLowerCase() === selectedValue.toLocaleLowerCase(),
		);
		if (!selectedValue) return;
		setValue(selected);
	}, [options, selectedValue, schema]);

	return (
		<FilterSelect
			name='operation'
			options={options}
			selectedValue={value?.value ?? ""}
			onSelection={value => onChange(value)}
			{...rest}
		/>
	);
}

export default OperatorSelection;
