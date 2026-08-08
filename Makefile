.PHONY: install validate test check

install:
	npm ci --ignore-scripts

validate:
	npm run validate

test:
	npm test


check: install
	npm test
	git diff --check
