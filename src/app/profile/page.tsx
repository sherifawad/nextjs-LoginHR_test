import EmployeeForm from "@/components/forms";

import { z } from "zod";
import { GetUniqueEmployeeAction } from "../(actions)/_EmployeesActions";

const Searchparams = z.object({
	employee: z.coerce.number().int().min(1).positive(),
});

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};

async function Profile({ searchParams }: Props) {
	let employee = undefined;
	let edit = false;

	const validateCode = Searchparams.safeParse(searchParams);
	if (validateCode.success) {
		employee = await GetUniqueEmployeeAction({
			id: validateCode.data.employee,
		});
		edit = employee ? true : false;
	}
	return (
		<>
			<h1 className='whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employee Profile
			</h1>
			<section>
				<EmployeeForm employee={employee} />
			</section>
		</>
	);
}

export default Profile;
