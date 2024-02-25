import { FilterOption } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { useCallback, useState } from "react";
import { z } from "zod";
import FilterSelect from "./FilterSelect";

type Props = {
	onPropertyChange: (value: keyof Employee) => Promise<void>;
};

const PropertySelection = ({ onPropertyChange }: Props) => {
	const [property, setProperty] = useState<
		EmployeePropertyOption | undefined
	>();

	const onChange = useCallback(
		(value: unknown) => {
			const validate = EmployeePropertyOption.safeParse(value);
			if (!validate.success) return;
			setProperty(validate.data);
			onPropertyChange(validate.data.value);
		},
		[onPropertyChange],
	);

	return (
		<FilterSelect
			name='property'
			options={employeeKeysOptions}
			selectedValue={property?.value ?? ""}
			onSelection={value => onChange(value)}
		/>
	);
};

export const employeeKeysOptions: FilterOption[] = Object.keys(
	Employee.shape,
).map(e => ({
	label: e,
	value: e,
}));

export const EmployeePropertyOption = z.object({
	label: z.custom<keyof Employee>(),
	value: z.custom<keyof Employee>(),
});
export type EmployeePropertyOption = z.infer<typeof EmployeePropertyOption>;

export default PropertySelection;
