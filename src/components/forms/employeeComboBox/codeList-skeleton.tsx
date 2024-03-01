import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

function CodeListSkeleton() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead colSpan={2}>
						<Skeleton className='h-8 ' />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...new Array(5)].map((_, idx) => (
					<TableRow key={idx}>
						{[...new Array(2)].map((_, idx) => (
							<TableCell key={idx}>
								<Skeleton className='h-6 w-full' />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default CodeListSkeleton;
