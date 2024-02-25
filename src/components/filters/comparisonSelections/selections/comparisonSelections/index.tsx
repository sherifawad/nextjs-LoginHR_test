import { Employee } from "@/validation/employeeSchema";
import { useCallback, useEffect, useState } from "react";
import FilterSelect from "../FilterSelect";
import { FilterComparisonOption, getComparisonList } from "./comparisonList";
import { FilterComparison } from "./comparisonSchema";

type Props = {
	property: keyof Employee | undefined;
	onComparisonChange: (value: FilterComparison) => void;
};

function ComparisonSelection({ property, onComparisonChange }: Props) {
	const [comparison, setComparison] = useState<
		FilterComparisonOption | undefined
	>();
	const [comparisonList, setComparisonList] = useState<
		FilterComparisonOption[]
	>([]);

	const onChange = useCallback(
		(value: unknown) => {
			const validate = FilterComparisonOption.safeParse(value);
			if (!validate.success) return;
			setComparison(validate.data);
			onComparisonChange(validate.data.value);
		},
		[onComparisonChange],
	);

	useEffect(() => {
		if (property) {
			const comparisonsList = getComparisonList(property);
			setComparisonList(comparisonsList);
		} else {
			setComparison(undefined);
			setComparisonList([]);
		}
	}, [property]);

	return (
		<FilterSelect
			name='operation'
			options={comparisonList}
			selectedValue={comparison?.value ?? ""}
			onSelection={value => onChange(value)}
		/>
	);
}

export default ComparisonSelection;
