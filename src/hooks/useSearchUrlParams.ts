import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Params = {
	[key: string]: string;
};

function useSearchUrlParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setParams = useCallback(
		(props: Params[]) => {
			const params = new URLSearchParams(searchParams);
			props.forEach(p => {
				Object.entries(p).forEach(([key, value]) => {
					params.set(key, value);
				});
			});
			router.push(`${pathname}?${params}`);
			router.refresh();
		},
		[pathname, router, searchParams],
	);
	const deleteParams = useCallback(
		(props: string[]) => {
			const params = new URLSearchParams(searchParams);
			props.forEach(p => {
				params.delete(p);
			});
			router.push(`${pathname}?${params}`);
			router.refresh();
		},
		[pathname, router, searchParams],
	);

	return {
		setParams,
		deleteParams,
	};
}

export default useSearchUrlParams;
