"use client";

import { cn } from "@/lib/utils";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";

const SideBarLinks = [
	{ name: "Employees", href: "/employees", icon: ListIcon },
];

function SidebarNoHeader() {
	const pathname = usePathname();

	return (
		<nav className='fixed z-50 flex h-screen min-w-14 max-w-44 flex-shrink-0 flex-col justify-between border-r-[1px] bg-primary-foreground p-4'>
			<Logo />
			<ul className='flex flex-1 flex-shrink-0 flex-col items-center border-t-[1px]'>
				{SideBarLinks.map(link => {
					const LinkIcon = link.icon;
					return (
						<Link
							key={link.name}
							href={link.href}
							className={cn(
								"bg-secondary-100 my-4 inline-flex flex-shrink-0 cursor-pointer items-center gap-x-2 rounded-lg bg-primary/50  p-3 text-secondary duration-200 hover:bg-primary ",
								{
									"bg-primary": pathname.includes(link.href),
								},
							)}
						>
							<LinkIcon />
							<div className='hidden md:block'>{link.name}</div>
						</Link>
					);
				})}
			</ul>
		</nav>
	);
}

export default SidebarNoHeader;
