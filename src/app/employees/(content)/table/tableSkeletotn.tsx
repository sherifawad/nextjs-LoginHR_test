import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const TableSkeleton = () => (
	<div className='w-sm md:w-md lg:w-lg mx-auto my-8 max-w-4xl'>
		<div className='xs:mx-0 mx-3 space-y-4'>
			<Skeleton className='h-8 w-full' />

			<div className='mx-auto  block w-[70svw] rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead colSpan={5}>
								<Skeleton className='h-8 ' />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...new Array(5)].map((_, idx) => (
							<TableRow key={idx}>
								{[...new Array(5)].map((_, idx) => (
									<TableCell key={idx}>
										<Skeleton className='h-6 w-full' />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className='md:w-md lg:w-lg grid  grid-rows-5 gap-3 md:hidden'>
				{[...new Array(5)].map((_, idx) => (
					<Skeleton key={idx} className='h-24 w-full' />
				))}
			</div>
			<Skeleton className='h-8 w-full' />
		</div>
	</div>
);

export default TableSkeleton;
