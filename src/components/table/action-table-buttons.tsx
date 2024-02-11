import { Button } from "@/components/ui/button";
import { employeesRepo } from "@/database/employees-repo";
import { Employee } from "@/types";

type Props = {
	employee: Employee;
};

function EmployeeActions({ employee }: Props) {
	const { delete: _delete } = employeesRepo;

	return (
		<div className='flex items-center gap-x-2'>
			<Button size={"sm"}>Edit</Button>
			<Button
				size={"sm"}
				variant={"destructive"}
				onClick={() => {
					_delete(employee.code!);
				}}
			>
				Delete
			</Button>
		</div>
	);
}

export default EmployeeActions;
