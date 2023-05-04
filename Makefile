build-wasm:
	cd wasm && GOARCH=wasm GOOS=js go build -o ../public/thema.wasm

node_modules:
	yarn install

run-frontend: node_modules
	yarn start

test: build-wasm run-frontend
