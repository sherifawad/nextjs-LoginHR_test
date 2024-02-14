import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

type Props = {
	items: {
		label: string;
		value: string;
	}[];

	selectedValue: string | undefined;
	onSelection: (value: string | undefined) => void;
};
function EmployeeSelect({ items, selectedValue, onSelection }: Props) {
	return (
		<Select
			value={selectedValue + ""}
			onValueChange={value => onSelection(value)}
		>
			<SelectTrigger className='bg-muted'>
				<SelectValue placeholder='Select ' />
			</SelectTrigger>
			<SelectContent position='popper'>
				{items.map(i => (
					<SelectItem key={i.value} value={i.value}>
						{i.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default EmployeeSelect;
