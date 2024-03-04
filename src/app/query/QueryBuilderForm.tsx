"use client";

import { useState } from "react";
import {
	Field,
	QueryBuilder,
	RuleGroupType,
	formatQuery,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

const fields: Field[] = [
	{ name: "firstName", label: "First Name" },
	{ name: "lastName", label: "Last Name" },
];
function QueryBuilderForm() {
	const [query, setQuery] = useState<RuleGroupType>({
		combinator: "and",
		rules: [
			{ field: "firstName", operator: "=", value: "Steve" },
			{ field: "lastName", operator: "=", value: "Vai" },
		],
	});

	return (
		<>
			<QueryBuilder
				fields={fields}
				query={query}
				onQueryChange={q => setQuery(q)}
			/>
			<h4>
				SQL as result of <code>formatQuery(query, "sql")</code>:
			</h4>
			<pre>{formatQuery(query, "sql")}</pre>
		</>
	);
}

export default QueryBuilderForm;
