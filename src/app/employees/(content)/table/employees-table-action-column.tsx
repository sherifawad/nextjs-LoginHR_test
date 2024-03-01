import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSearchUrlParams from "@/hooks/useSearchUrlParams";
import { Employee } from "@/validation/generated-zod-schemas";
import { Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

interface EmployeesActionsProps<TData> {
	row: Row<TData>;
	onDelete: (id: number) => Promise<void>;
}

export function EmployeesActions<TData>({
	row,
	onDelete,
}: EmployeesActionsProps<TData>) {
	const employee = row.original as Employee;

	// const [isOpen, setIsOpen] = useState(false);
	// const [isDialogOpen, setIsDialogOpen] = useState(false);
	// const { setParams, deleteParams, router } = useSearchUrlParams();
	// const { toast } = useToast();
	// const [isPending, startTransition] = useTransition();

	// const deleteEmployee = useCallback(async () => {
	// 	try {
	// 		setIsOpen(false);
	// 		await DeleteEmployee(employee.code);
	// 		toast({
	// 			variant: "success",
	// 			title: "Deleted successfully",
	// 		});
	// 		startTransition(() => {
	// 			window.location.reload();
	// 		});
	// 	} catch (error) {
	// 		console.log("🚀 ~ deleteEmployee ~ error:", error);
	// 		toast({
	// 			variant: "destructive",
	// 			title: "Uh oh! Something went wrong.",
	// 			description: error instanceof Error ? error.message : `${error}`,
	// 		});
	// 	}
	// }, [employee.code, toast]);

	// const onDialogChange = useCallback(
	// 	(value: boolean) => {
	// 		setIsOpen(false);
	// 		if (value) {
	// 			setParams([{ employee: employee.code + "" }]);
	// 		} else {
	// 			deleteParams(["employee"]);
	// 			setIsDialogOpen(false);
	// 		}
	// 	},
	// 	[deleteParams, employee.code, setParams],
	// );
	const { searchParams, pathname } = useSearchUrlParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
				>
					<MoreHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[160px]'>
				<DropdownMenuItem asChild>
					<Link
						href={`/employees/${employee.id}`}
						className='flex cursor-pointer justify-center bg-primary  text-primary-foreground'
					>
						Edit
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='flex cursor-pointer justify-center bg-destructive  text-destructive-foreground'
					onClick={() => onDelete(employee.id)}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default EmployeesActions;
