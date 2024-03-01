import { Employee, Position } from "@/validation/generated-zod-schemas";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const positions = await Promise.all(
		[...Array(10)].map((_, i) => {
			const newPosition: Omit<Position, "id"> = {
				code: i + 1,
				name: faker.person.jobType(),
			};
			return prisma.position.create({
				data: newPosition,
			});
		}),
	);

	await Promise.all(
		[...Array(30)].map((_, i) => {
			const codes = positions.map(p => p.code);
			const newEmployee: Omit<Employee, "id"> = {
				code: i + 1,
				name: faker.person.fullName(),
				salaryStatus: faker.number.int({ min: 0, max: 1 }),
				positionId: faker.number.int({
					min: Math.min(...codes),
					max: Math.max(...codes),
				}),
			};

			return prisma.employee.create({
				data: newEmployee,
			});
		}),
	);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
