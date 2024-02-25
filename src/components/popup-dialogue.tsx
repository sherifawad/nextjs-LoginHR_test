"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { ReactNode } from "react";

type Props = {
	triggerComponent: () => JSX.Element;
	children: ReactNode;
	title: string;
	openDialog?: boolean;
};

function PopUpDialogue({
	triggerComponent,
	children,
	title,
	openDialog,
}: Props) {
	const { deleteParams } = useSearchUrlParams();
	const onClose = (value: boolean) => {
		if (!value) {
			deleteParams(["employee"]);
		}
	};
	return (
		<Dialog open={openDialog} onOpenChange={e => onClose(e)}>
			<DialogTrigger asChild>{triggerComponent()}</DialogTrigger>
			<DialogContent className=''>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default PopUpDialogue;
