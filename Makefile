.PHONY: install validate test check

install:
	npm ci

validate:
	npm run validate

test:
	npm test

check: test
	git diff --check
