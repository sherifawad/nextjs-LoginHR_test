import { Input } from "../../ui/input";

const CodeInput = ({
	value,
	...rest
}: React.ComponentPropsWithoutRef<"input">) => {
	return (
		<Input
			className='mt-1 h-10 w-full min-w-10 rounded border border-none bg-muted  px-4 text-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
			value={value === -1 ? "" : value}
			{...rest}
		/>
	);
};

export default CodeInput;
