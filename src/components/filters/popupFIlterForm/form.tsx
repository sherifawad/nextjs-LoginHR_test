import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateLabelValueEmployeesList } from "@/lib/utils/filterUtils";
import {
	BasicValues,
	EmployeeFilterComparisonOption,
	EmployeePropertyOption,
	FilterOption,
	FilterValueSelect,
} from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useCallback,
	useState,
} from "react";
import {
	PropertiesLabels,
	getComparisonList,
	setComparisonComponentType,
} from "../constants";
import { FilterResult } from "../filterList";
import FilterInput from "./FIlterInput";
import FilterSelect from "./FilterSelect";

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	addFilter: (filter: EmployeeFilter) => FilterResult;
	initialEmployees: Employee[];
};
function FilterPopUpForm({ setIsOpen, addFilter, initialEmployees }: Props) {
	// Employee Properties
	const [property, setProperty] = useState<
		EmployeePropertyOption | undefined
	>();
	const onPropertyChange = useCallback((value: EmployeePropertyOption) => {
		setOptions([]);
		setProperty(value);
		const comparisonsList = getComparisonList(value.label);
		setOperationList(comparisonsList);
	}, []);

	// values
	const [data, setData] = useState<BasicValues | undefined>();
	const [component, setComponent] = useState<FilterValueSelect | undefined>();
	const [options, setOptions] = useState<FilterOption[]>([]);

	// comparison
	const [operation, setOperation] = useState<
		EmployeeFilterComparisonOption | undefined
	>();
	const [operationList, setOperationList] = useState<
		EmployeeFilterComparisonOption[]
	>([]);
	const onOperationChange = useCallback(
		async (value: EmployeeFilterComparisonOption) => {
			setOptions([]);
			setOperation(value);
			const component = setComparisonComponentType(
				property!.label,
				value.label,
			);
			setComponent(component);
			if (component === FilterValueSelect.Enum.LIST) {
				const result = generateLabelValueEmployeesList(
					initialEmployees,
					property!.value,
				);
				setOptions(result);
			}
		},
		[initialEmployees, property],
	);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (property && operation && data) {
			const { result } = addFilter({
				property: property.value,
				operation: operation.value,
				data,
			});
			if (result === "success") {
				setIsOpen(false);
			}
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Card className='w-[350px]'>
				<CardHeader>
					{/* <CardTitle>Choose Desired Filters</CardTitle> */}
					<CardDescription>Choose Desired Filters</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{/* Employee Properties */}
						<FilterSelect
							name='property'
							options={PropertiesLabels}
							selectedValue={property?.value}
							onSelection={value => onPropertyChange(value as any)}
						/>
						{/* Operators */}
						<FilterSelect
							name='operation'
							options={operationList}
							selectedValue={operation?.value}
							onSelection={value => onOperationChange(value as any)}
						/>
						{/* Inputs */}
						{!operation?.value || !property?.value ? (
							<Input disabled className='bg-muted' />
						) : (
							<FilterInput
								setValues={value => setData(value)}
								values={data}
								componentToShow={component}
								options={options}
							/>
						)}
					</div>
				</CardContent>
				<CardFooter className='flex justify-between'>
					<Button
						type='button'
						onClick={() => setIsOpen(false)}
						variant='outline'
					>
						Cancel
					</Button>
					<Button type='submit'>Deploy</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

export default FilterPopUpForm;
