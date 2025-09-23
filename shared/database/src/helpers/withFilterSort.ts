import { type Database } from "../index";

import {
  type ComparisonOperatorExpression,
  type Expression,
  type OperandValueExpressionOrList,
  type ReferenceExpression,
} from "kysely";
import { OrderByExpression } from "kysely";

type FilterOperator = "eq" | "ne" | "lt" | "gt" | "in";
type Filter<T extends keyof Database> =
  `${string & keyof Database[T]}[${FilterOperator}]${string | number | boolean}`[];

type SortOrder = "asc" | "desc";
type Sorter<T extends keyof Database> =
  `${string & keyof Database[T]}.${SortOrder}`[];

type ExtractTableAlias<DB, T extends keyof DB> = T extends string ? T : never;

interface WhereableQueryBuilder<DB, TB extends keyof DB, O> {
  where<RE extends ReferenceExpression<DB, TB>>(
    lhs: RE,
    op: ComparisonOperatorExpression,
    rhs: OperandValueExpressionOrList<DB, TB, RE>,
  ): WhereableQueryBuilder<DB, TB, O>;
  where<E extends Expression<unknown>>(
    expression: E,
  ): WhereableQueryBuilder<DB, TB, O>;
  orderBy<OB extends OrderByExpression<DB, TB, O>>(
    expr: OB,
    modifiers: SortOrder,
  ): WhereableQueryBuilder<DB, TB, O>;
}

export function withFilterSort<T extends keyof Database, O>(
  query: WhereableQueryBuilder<Database, ExtractTableAlias<Database, T>, O>,
  tableName: T,
  input: { filter: Filter<T> | undefined; sort: Sorter<T> | undefined },
): WhereableQueryBuilder<Database, ExtractTableAlias<Database, T>, O> {
  const { sort, filter, ids } = input;

  let modifiedQuery = query;

  if (filter?.length) {
    const mapOperatorsToSql = {
      eq: "=",
      ne: "!=",
      lt: ">",
      gt: "<",
      in: "in",
    } as const;

    for (const filterExpression of filter) {
      const matchResult = filterExpression.match(/(.*)\[(.*)\](.*)/);

      if (matchResult === null) {
        continue;
      }

      const column = matchResult[1];
      const operator = matchResult[2] as FilterOperator;
      const value = matchResult[3];

      const columnRef = `${String(tableName)}.${column}` as ReferenceExpression<
        Database,
        ExtractTableAlias<Database, T>
      >;

      modifiedQuery = modifiedQuery.where(
        columnRef,
        mapOperatorsToSql[operator],
        value,
      );
    }
  }

  if (sort?.length) {
    for (const sortExpression of sort) {
      const [field, order] = sortExpression.split(".");
      modifiedQuery = modifiedQuery.orderBy(
        field as OrderByExpression<Database, ExtractTableAlias<Database, T>, O>,
        order as SortOrder,
      );
    }
  }

  return modifiedQuery;
}
