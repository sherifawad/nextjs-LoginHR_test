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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useKeyPress } from "@/hooks/useKeyPress";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
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
	const { toast } = useToast();
	const { setParams, router } = useSearchUrlParams();
	const [isPending, startTransition] = React.useTransition();

	const onInputChange = (input: string) => {
		if (isNaN(Number(input))) {
			toast({
				variant: "destructive",
				title: "Invalid Input.",
				description: "Only Numbers Allowed",
			});
			return;
		}
		setSelectedCode(+input);
		onSelection(+input);
		// setTimeout(() => {
		// 	if (input) {
		// 		deleteParams(["employee"]);
		// 	}
		// }, 1000);
	};

	useKeyPress(async () => {
		if (disabled) return;
		toast({
			variant: "default",
			title: "F8 Key Pressed",
			description: "New Key Selected",
		});
		startTransition(async () => {
			const newCode = await GetNewEmployee();
			onInputChange(newCode + "");
			setParams([{ employee: newCode + "" }]);
		});
	}, ["F8"]);

	return (
		<>
			{isPending ? (
				<Skeleton className='h-11 w-full' />
			) : (
				<div className='flex flex-shrink-0 flex-row-reverse items-center gap-x-2 bg-muted px-2'>
					<div className='flex flex-1 items-center gap-x-2 bg-muted px-2'>
						<CodeInput
							type='text'
							name='code'
							id='code'
							value={selectedCode}
							onInputChange={onInputChange}
							disabled={isPending}
						/>
						{!disabled && <CommandShortcut>⌘F8</CommandShortcut>}
					</div>
					{!disabled && (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<TriggerButton isOpen={open} />
							</PopoverTrigger>
							<PopoverContent className='h-72 overflow-y-scroll p-0'>
								<EmployeesCodesTable
									onRowSelect={code => {
										onInputChange(code + "");
										setOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					)}
				</div>
			)}
		</>
	);
}

const TriggerButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button"> & { isOpen: boolean }
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
				{props.isOpen ? (
					<ArrowUpCircle className='mr-2 h-4 w-4' />
				) : (
					<ArrowDownCircle className='mr-2 h-4 w-4' />
				)}
				<div>Code</div>
			</div>
		</Button>
	);
});
TriggerButton.displayName = "TriggerButton";

export default CodeComboBox;
