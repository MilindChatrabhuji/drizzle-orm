import type { Column } from '~/column.ts';
import type { SQL } from '~/sql/sql.ts';
import { sql } from '~/sql/sql.ts';
import type { Table } from '~/table.ts';
import { getTableName } from '~/table.utils.ts';

export interface WrapColumnConfig {
	/** Custom SQL wrapper applied during SELECT projections (e.g. `(c) => sql\`ST_AsText(${c})\``) */
	select?: (column: SQL) => SQL;
	/** Custom SQL wrapper applied during INSERT statements (e.g. `(c) => sql\`ST_GeomFromText(${c})\``) */
	insert?: (value: SQL) => SQL;
	/** Custom SQL wrapper applied during UPDATE statements */
	update?: (value: SQL) => SQL;
}

export interface WrappedColumn<T = unknown> {
	select: SQL.Aliased<T>;
	insert: SQL;
	update: SQL;
	column: Column;
}

/**
 * Wraps a database column in custom SQL expressions for SELECT, INSERT, and UPDATE queries.
 * Useful for PostGIS geometry/geography, cryptographic functions, and database-native transforms (#554).
 *
 * @example
 * ```ts
 * const geom = wrapColumn(places.geom, {
 *   select: (c) => sql`ST_AsText(${c})`,
 *   insert: (c) => sql`ST_GeomFromText(${c})`,
 *   update: (c) => sql`ST_GeomFromText(${c})`,
 * });
 * ```
 */
export function wrapColumn<T = unknown>(
	column: Column,
	config: WrapColumnConfig,
): WrappedColumn<T> {
	const table = (column as any).table as Table | undefined;
	const name = column.name;
	const alias = table ? `${getTableName(table)}_${name}_wrapped` : `${name}_wrapped`;

	const selectSql = config.select
		? config.select(sql.raw(`"${name}"`))
		: sql.raw(`"${name}"`);

	const insertSql = config.insert
		? config.insert(sql.placeholder(name))
		: sql.placeholder(name);

	const updateSql = config.update
		? config.update(sql.placeholder(name))
		: sql.placeholder(name);

	return {
		select: selectSql.as(alias) as SQL.Aliased<T>,
		insert: insertSql,
		update: updateSql,
		column,
	};
}
