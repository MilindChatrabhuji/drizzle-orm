import { describe, expect, it } from 'vitest';
import { gelTable, text as gelText } from '~/gel-core/index.ts';
import { QueryBuilder as GelQueryBuilder } from '~/gel-core/query-builders/query-builder.ts';
import { mysqlTable, text as mysqlText } from '~/mysql-core/index.ts';
import { QueryBuilder as MySqlQueryBuilder } from '~/mysql-core/query-builders/query-builder.ts';
import { pgTable, text as pgText } from '~/pg-core/index.ts';
import { QueryBuilder as PgQueryBuilder } from '~/pg-core/query-builders/query-builder.ts';
import { singlestoreTable, text as singlestoreText } from '~/singlestore-core/index.ts';
import { QueryBuilder as SingleStoreQueryBuilder } from '~/singlestore-core/query-builders/query-builder.ts';
import { sql } from '~/sql/sql.ts';
import { sqliteTable, text as sqliteText } from '~/sqlite-core/index.ts';
import { QueryBuilder as SQLiteQueryBuilder } from '~/sqlite-core/query-builders/query-builder.ts';

describe('offset(0) in query builders (#6599)', () => {
	it('pg: should include offset 0 in select query', () => {
		const table = pgTable('users', { id: pgText('id') });
		const qb = new PgQueryBuilder();

		const query = qb.select().from(table).offset(0).toSQL();
		expect(query.sql).toBe('select "id" from "users" offset $1');
		expect(query.params).toEqual([0]);
	});

	it('pg: should omit offset when undefined', () => {
		const table = pgTable('users', { id: pgText('id') });
		const qb = new PgQueryBuilder();

		const query = qb.select().from(table).offset(undefined as any).toSQL();
		expect(query.sql).toBe('select "id" from "users"');
		expect(query.params).toEqual([]);
	});

	it('pg: should support placeholder offset', () => {
		const table = pgTable('users', { id: pgText('id') });
		const qb = new PgQueryBuilder();

		const query = qb.select().from(table).offset(sql.placeholder('offset')).toSQL();
		expect(query.sql).toBe('select "id" from "users" offset $1');
	});

	it('pg: subquery fenced with offset 0 retains offset in SQL', () => {
		const table = pgTable('users', { id: pgText('id') });
		const qb = new PgQueryBuilder();

		const sub = qb.select().from(table).offset(0).as('sub');
		const query = qb.select().from(sub).toSQL();
		expect(query.sql).toBe('select "id" from (select "id" from "users" offset $1) "sub"');
		expect(query.params).toEqual([0]);
	});

	it('pg: should include offset 0 in set operations query', () => {
		const table = pgTable('users', { id: pgText('id') });
		const qb = new PgQueryBuilder();

		const query = qb.select().from(table).union(qb.select().from(table)).offset(0).toSQL();
		expect(query.sql).toBe('(select "id" from "users") union (select "id" from "users") offset $1');
		expect(query.params).toEqual([0]);
	});

	it('mysql: should include offset 0 in select query', () => {
		const table = mysqlTable('users', { id: mysqlText('id') });
		const qb = new MySqlQueryBuilder();

		const query = qb.select().from(table).offset(0).toSQL();
		expect(query.sql).toBe('select `id` from `users` offset ?');
		expect(query.params).toEqual([0]);
	});

	it('mysql: should omit offset when undefined', () => {
		const table = mysqlTable('users', { id: mysqlText('id') });
		const qb = new MySqlQueryBuilder();

		const query = qb.select().from(table).offset(undefined as any).toSQL();
		expect(query.sql).toBe('select `id` from `users`');
		expect(query.params).toEqual([]);
	});

	it('mysql: should include offset 0 in set operations query', () => {
		const table = mysqlTable('users', { id: mysqlText('id') });
		const qb = new MySqlQueryBuilder();

		const query = qb.select().from(table).union(qb.select().from(table)).offset(0).toSQL();
		expect(query.sql).toBe('(select `id` from `users`) union (select `id` from `users`) offset ?');
		expect(query.params).toEqual([0]);
	});

	it('sqlite: should include offset 0 in select query', () => {
		const table = sqliteTable('users', { id: sqliteText('id') });
		const qb = new SQLiteQueryBuilder();

		const query = qb.select().from(table).offset(0).toSQL();
		expect(query.sql).toBe('select "id" from "users" offset ?');
		expect(query.params).toEqual([0]);
	});

	it('sqlite: should omit offset when undefined', () => {
		const table = sqliteTable('users', { id: sqliteText('id') });
		const qb = new SQLiteQueryBuilder();

		const query = qb.select().from(table).offset(undefined as any).toSQL();
		expect(query.sql).toBe('select "id" from "users"');
		expect(query.params).toEqual([]);
	});

	it('sqlite: should include offset 0 in set operations query', () => {
		const table = sqliteTable('users', { id: sqliteText('id') });
		const qb = new SQLiteQueryBuilder();

		const query = qb.select().from(table).union(qb.select().from(table)).offset(0).toSQL();
		expect(query.sql).toBe('select "id" from "users" union select "id" from "users" offset ?');
		expect(query.params).toEqual([0]);
	});

	it('singlestore: should include offset 0 in select query', () => {
		const table = singlestoreTable('users', { id: singlestoreText('id') });
		const qb = new SingleStoreQueryBuilder();

		const query = qb.select().from(table).offset(0).toSQL();
		expect(query.sql).toBe('select `id` from `users` offset ?');
		expect(query.params).toEqual([0]);
	});

	it('singlestore: should omit offset when undefined', () => {
		const table = singlestoreTable('users', { id: singlestoreText('id') });
		const qb = new SingleStoreQueryBuilder();

		const query = qb.select().from(table).offset(undefined as any).toSQL();
		expect(query.sql).toBe('select `id` from `users`');
		expect(query.params).toEqual([]);
	});

	it('singlestore: should include offset 0 in set operations query', () => {
		const table = singlestoreTable('users', { id: singlestoreText('id') });
		const qb = new SingleStoreQueryBuilder();

		const query = qb.select().from(table).union(qb.select().from(table)).offset(0).toSQL();
		expect(query.sql).toBe('(select `id` from `users`) union (select `id` from `users`) offset ?');
		expect(query.params).toEqual([0]);
	});

	it('gel: should include offset 0 in select query', () => {
		const table = gelTable('users', { id: gelText('id') });
		const qb = new GelQueryBuilder();

		const query = qb.select().from(table).offset(0).toSQL();
		expect(query.sql).toBe('select "users"."id" from "users" offset $1');
		expect(query.params).toEqual([0]);
	});

	it('gel: should omit offset when undefined', () => {
		const table = gelTable('users', { id: gelText('id') });
		const qb = new GelQueryBuilder();

		const query = qb.select().from(table).offset(undefined as any).toSQL();
		expect(query.sql).toBe('select "users"."id" from "users"');
		expect(query.params).toEqual([]);
	});

	it('gel: should include offset 0 in set operations query', () => {
		const table = gelTable('users', { id: gelText('id') });
		const qb = new GelQueryBuilder();

		const query = qb.select().from(table).union(qb.select().from(table)).offset(0).toSQL();
		expect(query.sql).toBe('(select "users"."id" from "users") union (select "users"."id" from "users") offset $1');
		expect(query.params).toEqual([0]);
	});
});
