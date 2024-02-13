import { JobCode } from "@/data";
import { BasicValues, FilterValueSelect } from "@/types";
import DateInput from "./DateInput/DateInput";
import DefaultInput from "./DefaultInput";
import MultiSelectInput from "./MultiSelectInput";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	setValues: (values: BasicValues | any[] | undefined) => void;
	values: BasicValues | any[] | undefined;
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
			{componentToShow === FilterValueSelect.enum.LIST && (
				<MultiSelectInput
					options={JobCode}
					onValuesChange={vs => setValues(vs)}
					values={values as any[] | undefined}
				/>
			)}
		</div>
	);
}

export default FilterInput;
