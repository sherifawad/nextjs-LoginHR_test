import { SelectionType } from "@/types";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useCallback, useEffect, useState } from "react";
import { SomeZodObject } from "zod";
import FilterSelect from "./FilterSelect";

type Props<T extends SomeZodObject> = SelectPrimitive.SelectProps & {
	onValueChange: (value?: string) => Promise<void>;
	selectedValue?: string;
	schema: T;
};

const PropertySelection = <T extends SomeZodObject>({
	onValueChange,
	selectedValue,
	schema,
	...rest
}: Props<T>) => {
	const [value, setValue] = useState<SelectionType | null | undefined>(
		undefined,
	);
	const [options, setOptions] = useState<SelectionType[]>([]);

	useEffect(() => {
		if (!options || options.length < 1) return;
		if (!selectedValue || !schema) return;
		const selected = options.find(
			o =>
				o.value.toLocaleLowerCase() ===
				selectedValue.toString().toLocaleLowerCase(),
		);
		if (!selectedValue) return;
		setValue(selected);
	}, [options, selectedValue, schema]);

	useEffect(() => {
		setOptions(
			Object.keys(schema.keyof().Values).map(t => ({
				label: t,
				value: t,
			})),
		);
	}, [schema]);

	const onChange = useCallback(
		(selected: SelectionType | undefined) => {
			setValue(selected);
			onValueChange(selected?.value);
		},
		[onValueChange],
	);

	return (
		<FilterSelect
			options={options}
			name='property'
			selectedValue={value?.value ?? ""}
			onSelection={value => onChange(value)}
			{...rest}
		/>
	);
};

export default PropertySelection;
