import { GripVertical } from "lucide-react";
import { forwardRef } from "react";
import type { DragHandleProps } from "react-querybuilder";

export const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
	({ className, title }, dragRef) => (
		<span ref={dragRef} className={className} title={title}>
			<GripVertical />
		</span>
	),
);

DragHandle.displayName = "DragHandle";
