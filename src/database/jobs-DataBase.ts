import "server-only";

import { EmployeePosition } from "@/validation/employeeSchema";

// // let Jobs = require("../data/jobs.json") as EmployeePosition[];
// const dataFilePath = path.join(process.cwd(), "src", "data", "jobs.json");
// const Jobs = (async function Jobs() {
// 	return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
// })() as unknown as Promise<EmployeePosition[]>;

let Jobs: EmployeePosition[] = require("../data/jobs.json");

export async function getAllJobs(): Promise<EmployeePosition[]> {
	return Jobs;
}
export async function findByCode(
	code: number,
): Promise<EmployeePosition | undefined> {
	const jobs = await getAllJobs();
	return jobs.find(x => x.positionCode === code);
}
