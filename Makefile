.PHONY: node_modules deps wasm start run help

node_modules: package.json yarn.lock ## Install Node modules.
	YARN_ENABLE_PROGRESS_BARS=false yarn install --immutable

deps: node_modules ## Install dependencies.

wasm: ## Build WASM artifact from Go code
	cd wasm && GOARCH=wasm GOOS=js go build -o ../public/thema.wasm

start: ## Run the Thema Playground
	yarn start

run: wasm start ## Build and run the Thema Playground

help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
