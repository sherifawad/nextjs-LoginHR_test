import {
	FilterOperator,
	filterOperatorSchema,
} from "@/validation/filter-operator-validation";
import { useCallback } from "react";

type Props = {
	keyLabel?: boolean;
};

function useFilterValuesOutput({ keyLabel = false }: Props) {
	const onSelection = useCallback(
		({
			Operator,
			_type,
			values,
		}: {
			Operator: FilterOperator;
			values: any[];
			_type: string;
		}): { label: string; value: any }[] | any[] => {
			if (Operator === filterOperatorSchema.enum.Between) {
				if (_type === "ZodNumber") {
					return keyLabel
						? values.map(v => ({
								label: v + "",
								value: Number(v),
							}))
						: values.map(v => Number(v));
				}
				if (_type === "ZodDate") {
					return keyLabel
						? values.map(v => {
								const formattedDate = new Intl.DateTimeFormat("en-GB").format(
									new Date(v),
								);
								return {
									label: formattedDate,
									value: new Date(v),
								};
							})
						: values.map(v => new Date(v));
				}
			}
			if (_type === "ZodNumber") {
				return keyLabel
					? values.map(v => ({
							label: v + "",
							value: Number(v),
						}))
					: values.map(v => Number(v));
			}
			if (_type === "ZodDate") {
				return keyLabel
					? values.map(v => {
							const formattedDate = new Intl.DateTimeFormat("en-GB").format(
								new Date(v),
							);
							return {
								label: formattedDate,
								value: new Date(v),
							};
						})
					: values.map(v => new Date(v));
			}
			return keyLabel
				? values.map(v => ({
						label: v,
						value: v,
					}))
				: values;
		},
		[keyLabel],
	);

	return {
		onSelection,
	};
}

export default useFilterValuesOutput;
