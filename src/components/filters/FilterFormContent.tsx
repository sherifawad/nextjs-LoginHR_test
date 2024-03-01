import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { SelectionType } from "@/types";
import { FilterOperator } from "@/validation/filter-operator-validation";
import { FilterItemObject } from "@/validation/filter-validation";
import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useCallback,
} from "react";
import { SomeZodObject } from "zod";
import { Input } from "../ui/input";
import FilterInput from "./FIlterInput";
import PropertySelection from "./selections/PropertySelection";
import OperatorSelection from "./selections/comparisonSelections";

type FilterFormContentProps<T extends SomeZodObject> =
	ComponentPropsWithoutRef<"div"> & {
		schema: T;
		selectionData: Partial<FilterItemObject<T>>;
		setSelectionData: Dispatch<SetStateAction<Partial<FilterItemObject<T>>>>;
	};

function FilterFormContent<T extends SomeZodObject>({
	selectionData,
	setSelectionData,
	schema,
	className,
	...rest
}: FilterFormContentProps<T>) {
	const { toast } = useToast();

	// Employee Properties

	const onPropertyChange = useCallback(
		async (value: string) => {
			setSelectionData(prev => ({
				...prev,
				Property: value,
				Value: undefined,
			}));
		},
		[setSelectionData],
	);

	// comparison

	const onComparisonChange = useCallback(
		async (value: FilterOperator) => {
			if (!selectionData?.Property) {
				toast({
					variant: "destructive",
					title: "Uh oh! Something went wrong.",
					description: "Select Comparison Property",
				});
				return;
			}
			setSelectionData(prev => ({
				...prev,
				Operator: value,
				Value: undefined,
			}));
		},
		[selectionData?.Property, setSelectionData, toast],
	);

	const onDataSet = useCallback(
		async (values: SelectionType[]) => {
			setSelectionData(prev => ({
				...prev,
				Value: values,
			}));
		},
		[setSelectionData],
	);

	return (
		<div
			className={cn(
				"grid grid-cols-[repeat(3,minmax(100px,1fr))] items-center  gap-4",
				className,
			)}
			{...rest}
		>
			{/* Employee Properties */}
			<PropertySelection
				selectedValue={selectionData?.Property}
				schema={schema}
				onValueChange={async value => {
					if (!value) return;
					onPropertyChange(value);
				}}
			/>
			{/* Operators */}
			<OperatorSelection
				property={selectionData?.Property}
				schema={schema}
				onValueChange={async value => {
					if (!value) return;
					onComparisonChange(value as FilterOperator);
				}}
			/>
			{/* <Input className='bg-muted' onChange={e => onDataSet(e.target.value)} /> */}
			{/* Inputs */}
			{selectionData?.Operator && selectionData?.Property ? (
				<FilterInput
					property={selectionData?.Property}
					Operator={selectionData?.Operator}
					selectedValues={selectionData?.Value?.map(v => ({
						...v,
						value: v.toString(),
					}))}
					schema={schema}
					onValuesChange={async values => {
						onDataSet(values);
					}}
				/>
			) : (
				<Input disabled className='bg-muted' />
			)}
		</div>
	);
}

export default FilterFormContent;
