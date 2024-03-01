import { searchParamsContext } from "@/context/serarchParamsContext";
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
			const params = searchParamsContext.update({
				params: props,
				currentParams: searchParams,
			});
			const route = `${pathname}?${params}`;
			setRoute(pathname);

			router.replace(route);
		},
		[pathname, router, searchParams],
	);
	const setParams = useCallback(
		(props: Params[]) => {
			const params = searchParamsContext.create({
				params: props,
				currentParams: searchParams,
			});
			const route = `${pathname}?${params}`;
			setRoute(route);
			router.replace(route);
		},
		[pathname, router, searchParams],
	);
	const deleteParams = useCallback(
		(props: string[]) => {
			const params = searchParamsContext.delete({
				keys: props,
				currentParams: searchParams,
			});
			const route = `${pathname}?${params}`;
			setRoute(route);
			router.replace(route);
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
