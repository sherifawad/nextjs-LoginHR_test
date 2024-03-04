import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SwitchProps } from "@radix-ui/react-switch";
import type { NotToggleProps as QueryToggleProps } from "react-querybuilder";

type NotToggleProps = QueryToggleProps & Partial<SwitchProps>;

export const NotToggle = ({
	className,
	handleOnChange,
	label,
	checked,
	title,
	disabled,
	testID,
	path: _path,
	level: _level,
	context: _context,
	validation: _validation,
	schema: _schema,
	ruleGroup: _ruleGroup,
	id,
	...otherProps
}: NotToggleProps) => (
	<div className='flex items-center space-x-2'>
		<Switch
			id={id}
			disabled={disabled}
			checked={checked}
			onCheckedChange={e => handleOnChange(e)}
		/>
		<Label htmlFor={id}>{label}</Label>
	</div>
);

NotToggle.displayName = "NotToggle";
