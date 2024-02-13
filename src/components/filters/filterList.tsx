"use client";

import { Filter } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import FilterPopUp from "./popupFIlterForm";

function FilterList() {
	const [Filters, setFilters] = useState<Filter[]>([]);
	const addFilter = (filter: Filter) => {
		setFilters(prev => [...prev, filter]);
	};
	return (
		<div className=' mx-auto mb-8 flex  w-full max-w-md items-end justify-center gap-2  p-2'>
			<ul className='flex flex-wrap gap-2 self-start'>
				{Filters?.map((item, index) => (
					<li
						key={index}
						className='flex flex-1 items-center justify-between whitespace-nowrap rounded-md bg-muted p-1'
					>
						<p className='flex-1 flex-wrap px-1 text-sm text-primary'>{`${item.property?.label}_${item.operation?.label}_${JSON.stringify(item.data)}`}</p>

						<Button
							variant={"ghost"}
							size={"icon"}
							onClick={() =>
								setFilters(prev =>
									prev.filter(
										x =>
											x.operation.label !== item.operation.label &&
											x.property.label !== item.property.label,
									),
								)
							}
						>
							<span className='text-sm text-destructive'>X</span>
						</Button>
					</li>
				))}
			</ul>
			<FilterPopUp addFilter={addFilter} />
		</div>
	);
}

export default FilterList;
