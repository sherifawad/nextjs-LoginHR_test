import { Skeleton } from "@/components/ui/skeleton";

const FilterSkeleton = () => (
	<div className='w-sm md:w-md lg:w-lg mx-auto my-8 max-w-4xl'>
		<div className='xs:mx-0 mx-3 space-y-4'>
			<Skeleton className='h-8 w-full' />
			{[...new Array(5)].map((_, idx) => (
				<Skeleton key={idx} className='h-12 w-full' />
			))}
		</div>
	</div>
);

export default FilterSkeleton;
