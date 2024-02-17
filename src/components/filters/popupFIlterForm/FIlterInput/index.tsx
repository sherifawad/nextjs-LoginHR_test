import { BasicValues, FilterValueSelect } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { useMemo, useState } from "react";
import { FilterComparison } from "../../comparisonSelections/selections/comparisonSelections/comparisonSchema";
import { setComparisonComponentType } from "../../constants";
import BetweenInput from "./BetweenInput";
import DateInput from "./DateInput/DateInput";
import DatePickerWithRange from "./DateInput/DatePickerWithRange";
import DefaultInput from "./DefaultInput";
import MultiSelectInput from "./MultiSelectInput";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	onDataSet: (value: BasicValues) => Promise<void>;
	property: keyof Employee;
	comparison: FilterComparison;
};

function FilterInput({ onDataSet, property, comparison, ...rest }: Props) {
	const [componentToShow, setComponentToShow] = useState<
		FilterValueSelect | undefined
	>();

	useMemo(() => {
		const result = setComparisonComponentType(property, comparison);
		setComponentToShow(result);
	}, [comparison, property]);

	return (
		<div {...rest}>
			{componentToShow === FilterValueSelect.enum.DATE && (
				<DateInput onDateSelected={d => onDataSet(d)} />
			)}
			{componentToShow === FilterValueSelect.enum.DATE_RANGE && (
				<DatePickerWithRange
					onRangeDateInSecondStringSelected={d => onDataSet(d)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.TEXT && (
				<DefaultInput onValueChange={i => onDataSet(i)} />
			)}
			{componentToShow === FilterValueSelect.enum.RANGE && (
				<BetweenInput onValueChange={i => onDataSet(i)} />
			)}
			{componentToShow === FilterValueSelect.enum.LIST && (
				<MultiSelectInput
					onValuesChange={vs => onDataSet(vs)}
					property={property}
				/>
			)}
		</div>
	);
}

export default FilterInput;
