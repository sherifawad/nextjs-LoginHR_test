import { Button, ButtonProps } from "@/components/ui/button";
import type { ActionProps as QueryProps } from "react-querybuilder";

type ActionProps = QueryProps & ButtonProps;

export const ActionElement = ({
	className,
	handleOnClick,
	label,
	title,
	disabled,
	disabledTranslation,
	testID,
	ruleOrGroup: _rg,
	path: _path,
	level: _level,
	context: _context,
	validation: _validation,
	schema: _schema,
	...otherProps
}: ActionProps) => (
	<Button
		// TODO: Find a way to do better than "as any" here
		{...(otherProps as any)}
		data-testid={testID}
		type='button'
		className={className}
		title={disabledTranslation && disabled ? disabledTranslation.title : title}
		onClick={e => handleOnClick(e)}
		disabled={disabled && !disabledTranslation}
	>
		{disabledTranslation && disabled ? disabledTranslation.label : label}
	</Button>
);

ActionElement.displayName = "ActionElement";
