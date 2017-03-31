.PHONY: test

install:
	nodeenv --force .
	./bin/activate
	npm install

update:
	npm update


test:
	npm test
