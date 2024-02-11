import CardWithForm from "@/components/form";
// import dynamic from "next/dynamic";

// const CardWithForm = dynamic(() => import("../../../components/form"), {
// 	ssr: false,
// });

function RegisterPage() {
	return (
		<>
			<h1 className='py-8 text-3xl font-bold text-primary'>
				Create an Employee
			</h1>
			<section>
				<CardWithForm />
			</section>
		</>
	);
}

export default RegisterPage;
