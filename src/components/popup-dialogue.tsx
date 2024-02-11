import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type Props = {
	triggerComponent: () => JSX.Element;
	children: ReactNode;
	title: string;
};

function PopUpDialogue({ triggerComponent, children, title }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerComponent()}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default PopUpDialogue;
