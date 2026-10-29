import { describe, expect, it } from 'vitest';
import { sql } from '~/sql/sql.ts';
import { pgTable, text, serial } from '~/pg-core/index.ts';
import { wrapColumn } from '~/custom-column.ts';

const places = pgTable('places', {
	id: serial('id').primaryKey(),
	name: text('name'),
	geom: text('geom'),
});

describe('wrapColumn (#554)', () => {
	it('wraps SELECT projections with custom SQL expression', () => {
		const wrapped = wrapColumn(places.geom, {
			select: (c) => sql`ST_AsText(${c})`,
		});

		expect(wrapped.select).toBeDefined();
		expect(wrapped.column).toBe(places.geom);
	});

	it('wraps INSERT values with custom SQL expression', () => {
		const wrapped = wrapColumn(places.geom, {
			insert: (c) => sql`ST_GeomFromText(${c})`,
		});

		expect(wrapped.insert).toBeDefined();
	});

	it('wraps UPDATE values with custom SQL expression', () => {
		const wrapped = wrapColumn(places.geom, {
			update: (c) => sql`ST_GeomFromText(${c})`,
		});

		expect(wrapped.update).toBeDefined();
	});

	it('falls back to raw column identifiers when no wrapper is specified', () => {
		const wrapped = wrapColumn(places.geom, {});

		expect(wrapped.select).toBeDefined();
		expect(wrapped.insert).toBeDefined();
		expect(wrapped.update).toBeDefined();
	});
});
