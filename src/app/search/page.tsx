import { EmployeeFilter } from "@/validation/employeeSchema";
import SearchContent from "./(content)";

type Props = {};

function SearchPage({}: Props) {
	const submit = async (value: EmployeeFilter) => {};
	return (
		<div className='w-full px-2'>
			<h1 className='mx-auto whitespace-nowrap py-8 text-3xl font-bold text-primary'>
				Search
			</h1>
			<SearchContent />
		</div>
	);
}

export default SearchPage;
