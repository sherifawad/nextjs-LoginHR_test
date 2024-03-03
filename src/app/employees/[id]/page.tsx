import {
	GetAllEmployeesAction,
	GetUniqueEmployeeAction,
} from "@/app/(actions)/_EmployeesActions";
import EmployeeForm from "@/components/forms";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
	const result = await GetAllEmployeesAction();
	if (result)
		return result.items.map(e => ({
			id: e.id + "",
		}));
	return [];
}

async function EmployeeProfilePage({
	params: { id },
}: {
	params: { id: string };
}) {
	if (!id || isNaN(Number(id))) notFound();
	const employee = await GetUniqueEmployeeAction({ id: +id });
	if (!employee) notFound();

	return (
		<>
			<h1 className='whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Employee Profile
			</h1>
			<section>
				<Suspense fallback={<>Employee Loading....</>}>
					<EmployeeForm employee={employee} />
				</Suspense>
			</section>
		</>
	);
}

export default EmployeeProfilePage;
