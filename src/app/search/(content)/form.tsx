import FilterFormContent from "@/components/filters/popupFIlterForm/FIlterInput/FilterFormContent";
import { cn } from "@/lib/utils";
import { EmployeeFilter } from "@/validation/employeeSchema";
import {
	ComponentPropsWithRef,
	FormEvent,
	ForwardedRef,
	forwardRef,
	useState,
} from "react";

type Props = ComponentPropsWithRef<"form"> & {
	submitHandler: (filter: EmployeeFilter) => Promise<void>;
};
const FilterForm = forwardRef(function FilterForm(
	{ submitHandler, className }: Props,
	ref: ForwardedRef<HTMLFormElement>,
) {
	const [selectionData, setSelectionData] = useState<Partial<EmployeeFilter>>({
		operation: undefined,
		data: undefined,
		property: undefined,
	});

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validate = EmployeeFilter.safeParse(selectionData);
		if (!validate.success) {
			return;
		}
		await submitHandler(validate.data);
	};

	return (
		<form
			ref={ref}
			onSubmit={onSubmit}
			className={cn("flex  gap-4 ", className)}
		>
			<FilterFormContent
				selectionData={selectionData}
				setSelectionData={setSelectionData}
				className='flex-1 flex-row-reverse'
			/>
		</form>
	);
});

export default FilterForm;
