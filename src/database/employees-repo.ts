import { Employee } from "@/types";

// employees in JSON file for simplicity, store in a db for production applications
let Employees = require("../data/employees.json") as Employee[];

// const jsonDirectory = path.join(process.cwd(), "tmp");
// const dataFilePath = path.join(process.cwd(), "src", "data", "employees.json");
// const dataFilePath = path.resolve("./src", "data", "employees.json");
// console.log("🚀 ~ dataFilePath:", dataFilePath);

// const Employees = (async function Employees() {
// 	return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
// })() as unknown as Promise<Employee[]>;

export const employeesRepo = {
	getAll: () => Employees,
	getByCode: (code: number) => Employees.find(x => x.code === code),
	find: (x: (x: Employee) => boolean) => Employees.find(x),
	filter: (x: (x: Employee) => boolean) => Employees.filter(x),
	create,
	update,
	delete: _delete,
};

function create(employee: Employee) {
	const employees = Employees;
	// generate new employee id
	employee.code = employees.length
		? Math.max(...employees.map(x => x.code)) + 1
		: 1;

	// add and save employee
	employees.push(employee);
	// await saveData(employees);
	return employee;
}

async function update(
	code: number,
	params: { [x in keyof Employee]: Employee[x] },
) {
	const employees = Employees;
	const employee = employees.find(x => x.code === code);
	if (!employee || employee == null) return;

	// update and save
	Object.assign(employee, params);
	// await saveData(employees);
	return employee;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(code: number) {
	let employees = Employees;
	// filter out deleted user and save
	employees = employees.filter(x => x.code !== code);
	// await saveData(employees);
}

// private helper functions

// async function saveData(employees: Employee[]) {
// 	// await fs.unlink(`${dataFilePath}`);
// 	await fs.writeFile(`${dataFilePath}`, JSON.stringify(employees, null, 4), {
// 		encoding: "utf8",
// 		flag: "w",
// 	});
// }
