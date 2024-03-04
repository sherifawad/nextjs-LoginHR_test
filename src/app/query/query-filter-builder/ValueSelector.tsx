import MultiSelectContent from "@/components/filters/FIlterInput/MultiSelectInput/MultiSelectContent";
import FilterSelect from "@/components/filters/selections/FilterSelect";
import { SelectionType } from "@/types";
import type { OptionList } from "react-querybuilder";
import {
	VersatileSelectorProps,
	isOptionGroupArray,
	useValueSelector,
} from "react-querybuilder";

export { isOptionGroupArray };

type Props = VersatileSelectorProps & {
	placeholder: string;
};

export const ValueSelector = ({
	className,
	handleOnChange,
	options: selectOptions,
	value,
	title,
	disabled,
	multiple,
	listsAsArrays,
	placeholder,
	testID,
	fieldData: _fieldData,
	path: _path,
	level: _level,
	context: _context,
	validation: _validation,
	schema: _schema,
	rule: _rule,
	rules: _rules,
	...otherProps
}: Props) => {
	const { onChange, val } = useValueSelector({
		handleOnChange,
		listsAsArrays,
		multiple,
		value,
	});

	return multiple ? (
		<MultiSelectContent
			onValuesChange={vs => onChange(vs)}
			data-testid={testID}
			title={title}
			className={className}
			disabled={disabled}
			options={toOptions(selectOptions)}
			// selectedValues={toArray(val).join(", ")}
			selectedValues={val as string[]}
		/>
	) : (
		<FilterSelect
			{...otherProps}
			data-testid={testID}
			className={className}
			selectedValue={val as string | undefined}
			disabled={disabled}
			onSelection={data => {
				if (!data) return;
				onChange(data.value);
			}}
			options={toOptions(selectOptions)}
		/>
	);
};

export const toOptions = (arr?: OptionList): SelectionType[] => {
	const list: SelectionType[] = [];
	isOptionGroupArray(arr)
		? arr.forEach(og => {
				og.options.forEach(opt => {
					list.push({
						label: opt.label,
						value: opt.name,
					});
				});
			})
		: Array.isArray(arr)
			? arr.forEach(opt => {
					list.push({
						label: opt.label,
						value: opt.name,
					});
				})
			: null;
	return list;
};

ValueSelector.displayName = "ValueSelector";
