install:
	yarn install

test:
	./node_modules/.bin/jest

test-watch:
	./node_modules/.bin/jest --watch

build:
	rm -rf lib/
	./node_modules/.bin/babel src -d lib
	cp src/reporters/html/base.html lib/reporters/html/

publish: install build
	npm publish
