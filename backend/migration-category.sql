-- Run ONCE on every existing MySQL database (Aiven, and your local one if it already has data).
-- Why: Hibernate created users.category as a MySQL ENUM with only the 5 old values.
-- ddl-auto=update never edits an existing column, so the 3 new categories would be rejected.
ALTER TABLE users MODIFY COLUMN category VARCHAR(30) NULL;
