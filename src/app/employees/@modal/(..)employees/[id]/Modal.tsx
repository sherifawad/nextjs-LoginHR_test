"use client";
import EmployeeForm from "@/components/forms";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/validation/generated-zod-schemas";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type Props = { employee: Employee };

function EmployeeModal({ employee }: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const router = useRouter();

	const onDialogCLose = () => {
		startTransition(() => router.back());
	};
	return (
		<Dialog open={isDialogOpen} onOpenChange={onDialogCLose}>
			<DialogContent className=''>
				<DialogHeader>
					<DialogTitle>Edit Employee</DialogTitle>
				</DialogHeader>
				<EmployeeForm employee={employee} disabled={true} />
			</DialogContent>
		</Dialog>
	);
}

export default EmployeeModal;
