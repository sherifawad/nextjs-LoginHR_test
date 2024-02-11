import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import Navbar from "@/components/layout/Navbar";

export default function EmployeeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className='grid min-h-screen w-full grid-rows-header bg-background'>
			<Navbar />
			<MaxWidthWrapper>
				<section className='min-h-screen  text-black'>{children}</section>
			</MaxWidthWrapper>
		</section>
	);
}
