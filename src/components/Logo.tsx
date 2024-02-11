import logo from "@/../public/login.webp";
import Image from "next/image";
import Link from "next/link";

function Logo() {
	return (
		<Link href='/' className=' mx-auto flex-shrink-0 rounded-full '>
			<Image
				src={logo}
				alt='Login-Hr Logo'
				className='flex-shrink-0 bg-primary-foreground'
			/>
		</Link>
	);
}

export default Logo;
