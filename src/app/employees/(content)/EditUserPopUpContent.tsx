import EmployeeForm from "@/components/forms";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/validation/generated-zod-schemas";

type Props = {
	employeeToUpdate: Employee;
};

const EditUserPopUpContent = ({ employeeToUpdate }: Props) => {
	return (
		<DialogContent className=''>
			<DialogHeader>
				<DialogTitle>Edit Employee</DialogTitle>
			</DialogHeader>
			<EmployeeForm
				employee={employeeToUpdate}
				editMode={true}
				// disabled={true}
			/>
		</DialogContent>
	);
};

export default EditUserPopUpContent;
