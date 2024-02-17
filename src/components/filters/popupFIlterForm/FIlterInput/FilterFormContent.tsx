import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { BasicValues } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useCallback,
} from "react";
import FilterInput from ".";
import PropertySelection from "../../comparisonSelections/selections/PropertySelection";
import ComparisonSelection from "../../comparisonSelections/selections/comparisonSelections";
import { FilterComparison } from "../../comparisonSelections/selections/comparisonSelections/comparisonSchema";

type FilterFormContentProps = ComponentPropsWithoutRef<"div"> & {
	selectionData: Partial<EmployeeFilter>;
	setSelectionData: Dispatch<SetStateAction<Partial<EmployeeFilter>>>;
};

function FilterFormContent({
	selectionData,
	setSelectionData,
	className,
	...rest
}: FilterFormContentProps) {
	const { toast } = useToast();

	// Employee Properties

	const onPropertyChange = useCallback(
		async (value: keyof Employee) => {
			setSelectionData(prev => ({
				...prev,
				property: value,
				data: undefined,
			}));
		},
		[setSelectionData],
	);

	// comparison

	const onComparisonChange = useCallback(
		async (value: FilterComparison) => {
			if (!selectionData?.property) {
				toast({
					variant: "destructive",
					title: "Uh oh! Something went wrong.",
					description: "Select Comparison Property",
				});
				return;
			}
			setSelectionData(prev => ({
				...prev,
				operation: value,
				data: undefined,
			}));
		},
		[selectionData?.property, setSelectionData, toast],
	);

	const onDataSet = useCallback(
		async (value: BasicValues) => {
			setSelectionData(prev => ({ ...prev, data: value }));
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
			<PropertySelection onPropertyChange={value => onPropertyChange(value)} />
			{/* Operators */}
			<ComparisonSelection
				property={selectionData?.property}
				onComparisonChange={value => onComparisonChange(value)}
			/>
			{/* Inputs */}
			{selectionData?.operation && selectionData?.property ? (
				<FilterInput
					property={selectionData.property}
					comparison={selectionData.operation}
					onDataSet={value => onDataSet(value)}
				/>
			) : (
				<Input disabled className='bg-muted' />
			)}
		</div>
	);
}

export default FilterFormContent;
