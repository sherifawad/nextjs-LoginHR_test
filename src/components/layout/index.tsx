"use client";

import { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const Layout = (props: PropsWithChildren) => {
	const [showSidebar, setShowSidebar] = useState(false);
	return (
		<div className='grid min-h-screen grid-rows-header bg-zinc-100'>
			<div className='z-10 bg-white shadow-sm'>
				<Navbar onMenuButtonClick={() => setShowSidebar(prev => !prev)} />
			</div>

			<div className='grid md:grid-cols-sidebar '>
				<div className='bg-zinc-50 shadow-md'>
					<Sidebar open={showSidebar} setOpen={setShowSidebar} />
				</div>
				{props.children}
			</div>
		</div>
	);
};
export default Layout;
