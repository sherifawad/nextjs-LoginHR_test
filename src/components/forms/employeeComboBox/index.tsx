"use client";

import * as React from "react";

import { GetNewEmployee } from "@/app/profile/_actions";
import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useKeyPress } from "@/hooks/useKeyPress";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { PlusCircleIcon } from "lucide-react";
import CodeInput from "./comboBox-button";
import EmployeesCodesTable from "./employeesCodesTable";

type Props = {
	selectedValue: number | undefined;
	onSelection: (selectedValue: number | undefined) => void;
	disabled?: boolean;
};

function CodeComboBox({ selectedValue, onSelection, disabled = false }: Props) {
	const [open, setOpen] = React.useState(false);
	const [selectedCode, setSelectedCode] = React.useState<number | undefined>(
		selectedValue,
	);

	const { deleteParams, setParams } = useSearchUrlParams();

	const onInputChange = (code: number) => {
		setSelectedCode(code);
		onSelection(code);
	};

	useKeyPress(async () => {
		if (disabled) return;
		const newCode = await GetNewEmployee();
		onInputChange(newCode);
		setParams([{ employee: newCode + "" }]);
	}, ["F8"]);

	return (
		<div className='flex flex-shrink-0 flex-row-reverse items-center gap-x-2 bg-muted px-2'>
			<div className='flex flex-1 items-center gap-x-2 bg-muted px-2'>
				<CodeInput
					type='text'
					name='code'
					id='code'
					value={selectedCode}
					onChange={e => {
						onInputChange(+e.target.value);
						setTimeout(() => {
							if (e) {
								deleteParams(["employee"]);
							}
						}, 1000);
					}}
				/>
				{!disabled && <CommandShortcut>⌘F8</CommandShortcut>}
			</div>
			{!disabled && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<TriggerButton />
					</PopoverTrigger>
					<PopoverContent className='h-72 overflow-y-scroll p-0'>
						<EmployeesCodesTable
							onRowSelect={code => {
								onInputChange(code);
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}

const TriggerButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button">
>((props, ref) => {
	return (
		<Button
			variant='ghost'
			size='sm'
			role='combobox'
			ref={ref}
			className='justify-between bg-muted text-primary hover:text-primary'
			{...props}
		>
			<div className='flex h-10 items-center justify-start gap-x-2  '>
				<PlusCircleIcon className='mr-2 h-4 w-4' />
				<div>Code</div>
			</div>
		</Button>
	);
});
TriggerButton.displayName = "TriggerButton";

export default CodeComboBox;
