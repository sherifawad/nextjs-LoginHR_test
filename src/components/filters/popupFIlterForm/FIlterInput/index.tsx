import { BasicValues, FilterOption, FilterValueSelect } from "@/types";
import BetweenInput from "./BetweenInput";
import DateInput from "./DateInput/DateInput";
import DatePickerWithRange from "./DateInput/DatePickerWithRange";
import DefaultInput from "./DefaultInput";
import MultiSelectInput from "./MultiSelectInput";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	setValues: (values: BasicValues) => void;
	values: BasicValues | undefined;
	componentToShow: FilterValueSelect | undefined;
	options: FilterOption[];
};

function FilterInput({
	options,
	componentToShow,
	setValues,
	values,
	...rest
}: Props) {
	return (
		<div {...rest}>
			{componentToShow === FilterValueSelect.enum.DATE && (
				<DateInput
					SelectedDate={values as Date | undefined}
					onDateSelected={d => setValues(d)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.DATE_RANGE && (
				<DatePickerWithRange
					dateRange={values as Date[] | undefined}
					onRangeDateSelected={d => setValues(d)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.TEXT && (
				<DefaultInput
					inputValue={values as string | undefined}
					onValueChange={i => setValues(i)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.RANGE && (
				<BetweenInput
					inputValue={values as string[] | undefined}
					onValueChange={i => setValues(i)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.LIST && (
				<MultiSelectInput
					options={options}
					onValuesChange={vs => setValues(vs)}
					values={values as string[] | undefined}
				/>
			)}
		</div>
	);
}

export default FilterInput;
