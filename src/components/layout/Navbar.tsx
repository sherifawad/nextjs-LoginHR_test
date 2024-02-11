"use client";

import { Edit2Icon, User2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NavbarLinks = [
	{
		name: "Register",
		href: "/employees/register",
		icon: User2Icon,
	},
	{ name: "Update", href: "/employees/update", icon: Edit2Icon },
];

function NavBar() {
	const pathname = usePathname();

	return (
		<nav className='sticky top-0 flex  border-b-[1px] bg-primary-foreground bg-opacity-30 backdrop-blur-lg'>
			{/* Navlinks */}
			<ul className='flex w-full max-w-3xl flex-row items-center justify-end gap-x-4  px-4'>
				{NavbarLinks.map(link => (
					<li
						key={link.href}
						className={cn(
							"inline-flex flex-shrink-0 cursor-pointer  items-center gap-x-2 rounded-lg text-sm font-medium text-primary/50   duration-200 hover:text-primary sm:text-lg ",
							{
								"text-primary": pathname === link.href,
							},
						)}
					>
						<Link href={link.href}>{link.name}</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default NavBar;
