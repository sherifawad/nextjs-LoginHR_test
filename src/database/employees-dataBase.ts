import "server-only";

import { Employee } from "@/validation/employeeSchema";
import path from "path";
// import { promises as fs } from "fs";
import { promises as fs } from "fs";

// // employees in JSON file for simplicity, store in a db for production applications
// let EmployeesData: Employee[] = (
// 	require("../data/employees.json") as Employee[]
// ).map(e => ({
// 	...e,
// 	hiringDate: new Date(e.hiringDate),
// }));

// const jsonDirectory = path.join(process.cwd(), "tmp");
const dataFilePath = path.join(process.cwd(), "src", "data", "employees.json");
// const dataFilePath = path.resolve("..", "/data", "employees.json");
// console.log("🚀 ~ dataFilePath:", dataFilePath);

const EmployeesData = async function Employees() {
	return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
};

export async function getAll(): Promise<Employee[]> {
	return ((await EmployeesData()) as Employee[]).map(e => ({
		...e,
		hiringDate: new Date(e.hiringDate),
	}));
	// return EmployeesData
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
	let employees = [...(await getAll())];
	const exist = await getByCode(employee.code);
	if (exist) throw new Error("Code Duplicate");
	// generate new employee id

	// add and save employee
	// EmployeesData = [...employees, employee];
	await saveData([...employees, employee]);

	return employee;
}

export async function update(
	code: number,
	params: { [x in keyof Employee]: Employee[x] },
): Promise<Employee> {
	let employees = [...(await getAll())];
	let employee = await getByCode(code);
	if (!employee || employee == null) throw new Error("Not Found");
	if (params.code && code !== params.code) {
		const employee = employees.find(x => x.code === params.code);
		if (employee) throw new Error("Invalid Code");
	}

	const result = employees.map(e => {
		if (e.code === code) {
			return {
				...e,
				...params,
			};
		}
		return e;
	});

	await saveData(result);

	// EmployeesData = [...result];

	return employee;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
export async function _delete(code: number): Promise<Employee> {
	let employees = [...(await getAll())];
	let employee = employees.find(x => x.code === code);
	if (!employee || employee == null) throw new Error("Not Found");
	const result = employees.filter(x => x.code !== code);
	await saveData(result);

	// EmployeesData = [...result];
	return employee;
}
export async function deleteMany(codeList: number[]): Promise<Employee[]> {
	try {
		let employees = [...(await getAll())];
		const deletedEmployees: Employee[] = [];
		const result = employees.filter(x =>
			codeList.every(l => {
				if (l !== x.code) {
					return true;
				}
				deletedEmployees.push(x);
				return false;
			}),
		);
		await saveData(result);

		// EmployeesData = [...result];
		return deletedEmployees;
	} catch (error) {
		return [];
	}
}

async function saveData(employees: Employee[]) {
	// await fs.unlink(`${dataFilePath}`);
	await fs.writeFile(`${dataFilePath}`, JSON.stringify(employees, null, 4), {
		encoding: "utf8",
		flag: "w",
	});
}
