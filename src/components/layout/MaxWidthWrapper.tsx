import { PropsWithChildren } from "react";

export default function MaxWidthWrapper(props: PropsWithChildren) {
	return (
		<div className='mx-auto  max-w-screen-lg  md:px-2.5'>{props.children}</div>
	);
}
