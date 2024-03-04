import type { Controls } from "react-querybuilder";
import { getCompatContextProvider } from "react-querybuilder";

import { ActionElement } from "./ActionElement";
import { DragHandle } from "./DragHandle";
import { NotToggle } from "./NotToggle";
import { ValueEditor } from "./ValueEditor";
import { ValueSelector } from "./ValueSelector";

export { ActionElement, DragHandle, NotToggle, ValueEditor, ValueSelector };

export const ControlElements: Partial<Controls> = {
	dragHandle: DragHandle,
	notToggle: NotToggle,
	valueEditor: ValueEditor,
	addGroupAction: ActionElement,
	addRuleAction: ActionElement,
	cloneGroupAction: ActionElement,
	cloneRuleAction: ActionElement,
	combinatorSelector: ValueSelector,
	fieldSelector: ValueSelector,
	operatorSelector: ValueSelector,
	lockRuleAction: ActionElement,
	lockGroupAction: ActionElement,
	removeGroupAction: ActionElement,
	removeRuleAction: ActionElement,
	valueSourceSelector: ValueSelector,
};

export const QueryBuilderQueryBuilder = getCompatContextProvider({
	key: "queryBuilder",
	controlElements: ControlElements,
});
