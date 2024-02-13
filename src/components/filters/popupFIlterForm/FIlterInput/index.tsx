import { BasicValues, FilterValueSelect } from "@/types";
import DateInput from "./DateInput/DateInput";
import DefaultInput from "./DefaultInput";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	setValues: (values: BasicValues | undefined) => void;
	values: BasicValues | undefined;
	componentToShow: FilterValueSelect | undefined;
};

function FilterInput({ componentToShow, setValues, values, ...rest }: Props) {
	return (
		<div {...rest}>
			{componentToShow === FilterValueSelect.enum.DATE && (
				<DateInput
					SelectedDate={values as Date | undefined}
					onDateSelected={d => setValues(d)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.DATE_RANGE && (
				<DateInput
					SelectedDate={values as Date | undefined}
					onDateSelected={d => setValues(d)}
				/>
			)}
			{componentToShow === FilterValueSelect.enum.TEXT && (
				<DefaultInput
					inputValue={values as string | number | undefined}
					onValueChange={i => setValues(i)}
				/>
			)}
		</div>
	);
}

export default FilterInput;
