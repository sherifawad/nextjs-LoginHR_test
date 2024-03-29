import { DeleteEmployee } from "@/app/profile/_actions";
import { Button } from "@/components/ui/button";
import { Employee } from "@/validation/employeeSchema";

type Props = {
	employee: Employee;
};

function EmployeeActions({ employee }: Props) {
	return (
		<div className='flex items-center gap-x-2'>
			<Button size={"sm"}>Edit</Button>
			<Button
				size={"sm"}
				variant={"destructive"}
				onClick={async () => {
					DeleteEmployee(employee.code!);
				}}
			>
				Delete
			</Button>
		</div>
	);
}

export default EmployeeActions;
