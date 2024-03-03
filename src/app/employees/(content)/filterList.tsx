"use client";

import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { EmployeeContext } from "../employeeContext";

function FilterList() {
	const { filterList, deleteEmployeesFilter } = useContext(
		EmployeeContext,
	) as EmployeeContext;
	return (
		<div className=' mx-auto mb-8 flex w-full  max-w-md flex-row-reverse items-end justify-center gap-2  p-2'>
			<ul className='flex flex-wrap gap-2 self-start'>
				{filterList?.map((item, index) => {
					return (
						<li
							key={`${index}_${item.Property}_${item.Operator.label}_${item.Value[0].label}`}
							className=''
						>
							<div className='flex flex-1 items-center justify-between gap-x-2 whitespace-nowrap rounded-md bg-muted p-1 px-3'>
								{
									<div className='flex flex-1 flex-wrap  gap-x-2 text-sm capitalize text-primary'>
										<span className=''>{item.Property}</span>
										<span className=''>{item.Operator.label}</span>
										{item.Value.map(v => (
											<span key={v.label} className=''>
												{v.label}
											</span>
										))}
									</div>
								}
								<Button
									variant={"ghost"}
									onClick={() => deleteEmployeesFilter(index)}
								>
									<span className='text-base text-destructive'>X</span>
								</Button>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default FilterList;
