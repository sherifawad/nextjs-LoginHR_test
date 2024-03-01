import { GetUniqueEmployeeAction } from "@/app/(actions)/_EmployeesActions";
import EmployeeModal from "./Modal";

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};

async function ProfileModal({ params: { id } }: { params: { id: string } }) {
	if (!id || isNaN(Number(id))) {
		return null;
	}
	const employee = await GetUniqueEmployeeAction({ id: +id });
	if (!employee) {
		return null;
	}
	return <EmployeeModal employee={employee} />;
}

export default ProfileModal;
