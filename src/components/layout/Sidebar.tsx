"use client";

import { cn } from "@/lib/utils";

type Props = {
	open: boolean;
	setOpen(open: boolean): void;
};
const Sidebar = ({ open, setOpen }: Props) => {
	return (
		<div
			className={cn({
				"flex flex-col justify-between": true, // layout
				"bg-indigo-700 text-zinc-50": true, // colors
				"fixed top-0 z-20 md:sticky md:top-16 md:z-0 md:w-full": true, // positioning
				"h-full w-[300px] md:h-[calc(100vh_-_64px)]": true, // for height and width
				".3s transition-transform ease-in-out md:translate-x-0": true, //animations
				"-translate-x-full ": !open, //hide sidebar to the left when closed
			})}
		>
			<nav className='top-0 md:sticky md:top-16'>
				{/* nav items */}
				<ul className='flex flex-col gap-2 py-2'>
					<li>links here</li>
				</ul>
			</nav>
		</div>
	);
};
export default Sidebar;
