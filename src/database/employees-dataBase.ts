import "server-only";

import { Employee } from "@/types";
import { promises as fs } from "fs";
import path from "path";

// employees in JSON file for simplicity, store in a db for production applications
// let Employees: Employee[] = (
// 	require("../data/employees.json") as Employee[]
// ).map(e => ({
// 	...e,
// 	hiringDate: new Date(e.hiringDate),
// }));

// const jsonDirectory = path.join(process.cwd(), "tmp");
const dataFilePath = path.join(process.cwd(), "src", "data", "employees.json");
// const dataFilePath = path.resolve("..", "/data", "employees.json");
// console.log("🚀 ~ dataFilePath:", dataFilePath);

const Employees = (async function Employees() {
	return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
})() as unknown as Promise<Employee[]>;

export async function getAll(): Promise<Employee[]> {
	return (await Employees).map(e => ({
		...e,
		hiringDate: new Date(e.hiringDate),
	}));
}
export async function getByCode(code: number): Promise<Employee | undefined> {
	return (await getAll()).find(x => x.code === code);
}
export async function getOne(
	x: (x: Employee) => boolean,
): Promise<Employee | undefined> {
	return (await getAll()).find(x);
}
export async function getMany(
	x: (x: Employee) => boolean,
): Promise<Employee[]> {
	return (await getAll()).filter(x);
}
export async function getNewCode(): Promise<number> {
	let employees = await getAll();
	if (!employees || employees.length === 1) return 1;
	const employeesByHighestCode = employees.sort((a, b) => b.code - a.code);
	return employeesByHighestCode[0].code + 1;
}

export async function create(employee: Employee): Promise<Employee> {
	let employees = await getAll();
	// generate new employee id

	// add and save employee
	employees.push(employee);
	await saveData(employees);
	return employee;
}

export async function update(
	code: number,
	params: { [x in keyof Employee]: Employee[x] },
): Promise<Employee> {
	let employees = await getAll();
	let employee = employees.find(x => x.code === code);
	if (!employee || employee == null) throw new Error("Not Found");
	if (params.code && code !== params.code) {
		const employee = employees.find(x => x.code === params.code);
		if (employee) throw new Error("Invalid Code");
	}

	Object.assign(employee, params);
	await saveData(employees);

	return employee;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
export async function _delete(code: number): Promise<Employee> {
	let employees = await getAll();
	let employee = employees.find(x => x.code === code);
	if (!employee || employee == null) throw new Error("Not Found");
	employees = employees.filter(x => x.code !== code);
	await saveData(employees);
	return employee;
}

async function saveData(employees: Employee[]) {
	// await fs.unlink(`${dataFilePath}`);
	await fs.writeFile(`${dataFilePath}`, JSON.stringify(employees, null, 4), {
		encoding: "utf8",
		flag: "w",
	});
}
