import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { SelectProps } from "@radix-ui/react-select";
import type { VersatileSelectorProps } from "react-querybuilder";
import { toArray, toOptions, useValueSelector } from "react-querybuilder";

type QueryValueSelectorProps = VersatileSelectorProps &
	SelectProps &
	DropdownMenuProps;

export const QueryValueSelector = ({
	className,
	handleOnChange,
	options,
	value,
	title,
	disabled,
	multiple,
	listsAsArrays,
	testID,
	fieldData: _fieldData,
	path: _path,
	level: _level,
	context: _context,
	validation: _validation,
	schema: _schema,
	...otherProps
}: QueryValueSelectorProps) => {
	const { onChange, val } = useValueSelector({
		handleOnChange,
		listsAsArrays,
		multiple,
		value,
	});

	return multiple ? (
		<Dropdown
			data-testid={testID}
			title={title}
			className={className}
			disabled={disabled}
			multiselect
			value={toArray(val).join(", ")}
			placeholder={placeholder}
			selectedOptions={toArray(val)}
			onOptionSelect={(_e, data) => onChange(data.selectedOptions)}
		>
			{toDropdownOptions(options)}
		</Dropdown>
	) : (
		<Select
			{...otherProps}
			data-testid={testID}
			title={title}
			className={className}
			value={val}
			disabled={disabled}
			multiple={!!multiple}
			onChange={(_e, data) => onChange(data.value)}
		>
			{toOptions(options)}
		</Select>
	);
};

QueryValueSelector.displayName = "QueryValueSelector";
