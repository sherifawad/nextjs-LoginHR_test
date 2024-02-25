import Logo from "@/components/Logo";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

export default function Home() {
	return (
		<MaxWidthWrapper>
			<section className='mx-auto my-24 flex min-h-[80sv] w-full flex-col items-center bg-primary px-2 py-8  sm:px-8 lg:flex-row'>
				<div className='lg:1/2 w-full items-center px-2 sm:px-8'>
					<div className='lg:hidden'>
						<div className='flex flex-row items-center justify-between'>
							<div className='inline-flex items-center text-sm font-medium text-gray-300 sm:text-lg'>
								<span className='item-center mx-3 inline-flex flex-shrink-0 justify-center rounded-full bg-gray-200 leading-none dark:bg-gray-600'>
									<Logo />
								</span>
								Login Hr
							</div>
							<h4 className='text-sm font-medium text-gray-300 dark:text-gray-50 sm:text-lg'>
								Live
							</h4>
						</div>
						<h1 className='py-4 text-3xl font-medium leading-snug text-gray-100 dark:text-gray-50 sm:mr-8 sm:text-4xl xl:py-4 xl:leading-normal'>
							Simple Employees Accounts CRUD and Filter
						</h1>
					</div>
					<div className='relative' style={{ paddingTop: "56.25%" }}>
						<iframe
							className='absolute inset-0 h-full w-full rounded-sm border border-white'
							src='https://www.youtube.com/embed/JwVaK6_ZEWk'
							title='YouTube video player'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
						></iframe>
					</div>
				</div>
				<div className='lg:1/2 w-full items-center sm:px-8'>
					<div className='hidden lg:block'>
						<h4 className='text-lg font-medium text-gray-200 dark:text-gray-50'>
							Live
						</h4>
						<h1 className='py-4 text-2xl font-medium leading-snug text-gray-100 dark:text-gray-50 sm:mr-8 sm:text-3xl xl:py-4 xl:leading-normal'>
							Employees Accounts CRUD and Filter
						</h1>
						<div className='inline-flex items-center text-lg font-medium text-gray-200'>
							<span className='item-center mx-3 inline-flex flex-shrink-0 justify-center rounded-full bg-gray-500 leading-none dark:bg-gray-600'>
								<Logo />
							</span>
							Login Hr
						</div>
					</div>
					<div className='mt-4 flex flex-row justify-between px-4 text-sm'>
						<p className='inline-flex items-center uppercase text-gray-200'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='mr-2 h-6 w-6 text-green-600'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fill-rule='evenodd'
									d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z'
									clip-rule='evenodd'
								/>
							</svg>
							Green
						</p>
						<p className='uppercase text-gray-200'>edition: open</p>
					</div>
					<div className='mx-auto   mt-10 flex w-full flex-none   flex-col-reverse   space-y-3 space-y-reverse lg:w-auto  lg:flex-row   lg:items-start lg:space-x-4 lg:space-y-0 xl:mx-0'></div>
				</div>
			</section>
		</MaxWidthWrapper>
	);
}
