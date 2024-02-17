import { EmployeeFilter } from "@/validation/employeeSchema";
import { Suspense } from "react";
import SearchContent from "./(content)";
import FilterSkeleton from "./(content)/FilterSkeleton";

type Props = {};

function SearchPage({}: Props) {
	const submit = async (value: EmployeeFilter) => {};
	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Search
			</h1>
			<Suspense fallback={<FilterSkeleton />}>
				<SearchContent />
			</Suspense>
		</div>
	);
}

export default SearchPage;
