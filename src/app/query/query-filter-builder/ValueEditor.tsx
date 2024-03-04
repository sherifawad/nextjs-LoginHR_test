import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ValueEditorProps } from "react-querybuilder";
import {
	getFirstOption,
	standardClassnames,
	useValueEditor,
} from "react-querybuilder";

export const ValueEditor = ({
	fieldData,
	operator,
	value,
	handleOnChange,
	title,
	className,
	type,
	inputType,
	values = [],
	listsAsArrays,
	parseNumbers,
	separator,
	valueSource: _vs,
	disabled,
	testID,
	selectorComponent: SelectorComponent = Select,
	validation: _validation,
	...props
}: ValueEditorProps) => {
	const { valueAsArray, multiValueHandler } = useValueEditor({
		handleOnChange,
		inputType,
		operator,
		value,
		type,
		listsAsArrays,
		parseNumbers,
		values,
	});

	if (operator === "null" || operator === "notNull") {
		return null;
	}

	const placeHolderText = fieldData?.placeholder ?? "";
	const inputTypeCoerced = (
		["in", "notIn"].includes(operator) ? "text" : inputType || "text"
	) as InputProps["type"];

	if (
		(operator === "between" || operator === "notBetween") &&
		(type === "select" || type === "text")
	) {
		const editors = ["from", "to"].map((key, i) => {
			if (type === "text") {
				return (
					<Input
						key={key}
						type={inputTypeCoerced}
						placeholder={placeHolderText}
						value={valueAsArray[i] ?? ""}
						className={`${standardClassnames.valueListItem} input`}
						disabled={disabled}
						onChange={e => multiValueHandler(e.target.value, i)}
					/>
				);
			}
			return (
				<SelectorComponent
					{...props}
					key={key}
					className={standardClassnames.valueListItem}
					handleOnChange={v => multiValueHandler(v, i)}
					disabled={disabled}
					value={valueAsArray[i] ?? getFirstOption(values)}
					options={values}
					listsAsArrays={listsAsArrays}
				/>
			);
		});

		return (
			<span data-testid={testID} className={className} title={title}>
				{editors[0]}
				{separator}
				{editors[1]}
			</span>
		);
	}

	switch (type) {
		case "select":
		case "multiselect":
			return (
				<SelectorComponent
					{...props}
					title={title}
					className={className}
					handleOnChange={handleOnChange}
					options={values}
					value={value}
					disabled={disabled}
					multiple={type === "multiselect"}
					listsAsArrays={listsAsArrays}
				/>
			);

		case "textarea":
			return (
				<Textarea
					className={className}
					value={value}
					title={title}
					placeholder={placeHolderText}
					disabled={disabled}
					onChange={e => handleOnChange(e.target.value)}
				/>
			);

		case "switch":
			return (
				<Switch
					className={className}
					title={title}
					checked={value}
					disabled={disabled}
					onCheckedChange={e => handleOnChange(e)}
				/>
			);

		case "checkbox":
			return (
				<Checkbox
					className={className}
					title={title}
					checked={value}
					disabled={disabled}
					onCheckedChange={e => handleOnChange(e)}
				/>
			);

		case "radio":
			return (
				<RadioGroup
					className={className}
					title={title}
					value={value}
					onValueChange={value => handleOnChange(value)}
					disabled={disabled}
				>
					{values.map(v => (
						<div key={v.name} className='flex items-center space-x-2'>
							<RadioGroupItem value={v.name} id={v.name} />
							<Label htmlFor={v.name}>Option One</Label>
						</div>
					))}
				</RadioGroup>
			);
	}

	return (
		<Input
			data-testid={testID}
			title={title}
			className={className}
			placeholder={placeHolderText}
			type={inputTypeCoerced}
			disabled={disabled}
			value={value}
			onChange={e => handleOnChange(e.target.value)}
		/>
	);
};

ValueEditor.displayName = "ValueEditor";
