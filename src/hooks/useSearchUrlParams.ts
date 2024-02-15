import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Params = {
	[key: string]: string;
};

function useSearchUrlParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [route, setRoute] = useState(`${pathname}`);

	const updateParams = useCallback(
		(props: Params[]) => {
			const params = new URLSearchParams(searchParams);
			props.forEach(p => {
				Object.entries(p).forEach(([key, value]) => {
					const current = params.get(key);
					params.set(key, current ? `${current},${value}` : value);
				});
			});
			const route = `${pathname}?${params}`;
			setRoute(route);
			router.push(route);
		},
		[pathname, router, searchParams],
	);
	const setParams = useCallback(
		(props: Params[]) => {
			const params = new URLSearchParams(searchParams);
			props.forEach(p => {
				Object.entries(p).forEach(([key, value]) => {
					params.set(key, value);
				});
			});
			const route = `${pathname}?${params}`;
			setRoute(route);
			router.push(route);
		},
		[pathname, router, searchParams],
	);
	const deleteParams = useCallback(
		(props: string[]) => {
			const params = new URLSearchParams(searchParams);
			props.forEach(p => {
				params.delete(p);
			});
			const route = `${pathname}?${params}`;
			setRoute(route);
			router.push(route);
		},
		[pathname, router, searchParams],
	);

	return {
		setParams,
		deleteParams,
		updateParams,
		router,
		pathname,
		searchParams,
		route,
	};
}

export default useSearchUrlParams;
