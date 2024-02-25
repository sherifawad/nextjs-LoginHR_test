import { type ReadonlyURLSearchParams } from "next/navigation";

type Params = {
	[key: string]: string;
};

type InputsProps = {
	params: Params[];
	currentParams?: ReadonlyURLSearchParams;
};

type DeleteInputsProps = {
	keys: string[];
	currentParams?: ReadonlyURLSearchParams;
};

const create = ({ params, currentParams }: InputsProps) => {
	const searchParams = new URLSearchParams(currentParams);
	params.forEach(p => {
		Object.entries(p).forEach(([key, value]) => {
			searchParams.set(key, value);
		});
	});
	return searchParams;
};

const update = ({ params, currentParams }: InputsProps) => {
	const searchParams = new URLSearchParams(currentParams);
	params.forEach(p => {
		Object.entries(p).forEach(([key, value]) => {
			const current = searchParams.get(key);
			searchParams.set(key, current ? `${current},${value}` : value);
		});
	});
	return searchParams;
};

const _delete = ({ keys, currentParams }: DeleteInputsProps) => {
	const searchParams = new URLSearchParams(currentParams);
	keys.forEach(p => {
		searchParams.delete(p);
	});
	return searchParams;
};

export const searchParamsContext = {
	create: create,
	update: update,
	delete: _delete,
};
