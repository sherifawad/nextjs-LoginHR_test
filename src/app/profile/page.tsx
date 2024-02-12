import EmployeeForm from "@/components/forms";

import { z } from "zod";
import { GetEmployeeUnique } from "./_actions";

const Searchparams = z.object({
	employee: z.coerce.number().int().min(1).positive(),
});

type Props = {
	searchParams: { [key: string]: string[] | string | undefined };
};

async function Profile({ searchParams }: Props) {
	let employee = undefined;

	const validateCode = Searchparams.safeParse(searchParams);
	if (validateCode.success) {
		employee = await GetEmployeeUnique(validateCode.data.employee);
	}
	return (
		<>
			<h1 className='py-8 text-3xl font-bold text-primary'>Employee Profile</h1>
			<section>
				<EmployeeForm employee={employee} />
			</section>
		</>
	);
}

export default Profile;
