import { GetAllEmployees } from "@/app/profile/_actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { enumToLabelKeyValues } from "@/lib/utils";
import {
	BasicValues,
	EmployeeFilterComparisonOption,
	EmployeePropertyOption,
	Filter,
	FilterOption,
	FilterValueSelect,
} from "@/types";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import {
	PropertiesLabels,
	getComparisonList,
	setComparisonComponentType,
} from "../constants";
import FilterInput from "./FIlterInput";
import FilterSelect from "./FilterSelect";

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	addFilter: (filter: Filter) => void;
};
function FilterPopUpForm({ setIsOpen, addFilter }: Props) {
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
	const [data, setData] = useState<BasicValues | any[] | undefined>();
	const [component, setComponent] = useState<FilterValueSelect | undefined>();
	const [options, setOptions] = useState<FilterOption[]>([]);
	const employees = useMemo(async () => await GetAllEmployees(), []);

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
				const list = (await employees).map(e => e[property!.label]);
				const result = enumToLabelKeyValues(list);
				setOptions(result);
			}
		},
		[employees, property],
	);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// const formData = new FormData(e.currentTarget);
		// const property = String(formData.get("property"));
		// const operation = String(formData.get("operation"));
		// console.log("👍👍👍👍", property);
		if (operation && property && data) {
			addFilter({
				property,
				operation,
				data,
			});
			setIsOpen(false);
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
