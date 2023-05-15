# Thema Playground

Thema Playground is an online service that allows users to write and run [Thema](https://github.com/grafana/thema) code
in a safe and sandboxed environment.
It's accessible via a web browser (available at [grafana.github.io/play-thema](grafana.github.io/play-thema)), and it
doesn't require you to install [Thema](https://github.com/grafana/thema) on your own computer.

It is primarily used for sharing and running Thema snippets.
So, you can write Thema code, compile and run it, and see the output directly in the web interface.
It's particularly useful for demonstrating Thema code behavior, asking for help with Thema code, learning the Thema
language or its [operations](https://github.com/grafana/thema/blob/main/docs/overview.md#about-thema-operations).

## Development

### Dependencies

To set up and run this project locally, you will need the following dependencies:

1. [Node.js](https://nodejs.org/en/)
2. [Yarn](https://yarnpkg.com/)
3. [Go](https://golang.org/)

### Running the project locally

1. Clone the [Thema Playground](https://github.com/grafana/play-thema) repository.

2. Install the application dependencies:
    ```bash
    make deps
    ```
3. Build the WASM artifact from Go code
    ```bash
    make wasm
    ```
4. Run the application
    ```bash
    make start
    ```
   This will start the development server on [localhost:3000](http://localhost:3000).

Alternatively, you can just run `make run` after having installed the dependencies, which does steps 3 and 4 in a single shot.

### Running the project locally

1. Clone the [Thema Playground](https://github.com/grafana/play-thema) repository.

2. Install the application dependencies:
    ```bash
    make deps
    ```
3. Build the WASM artifact from Go code
    ```bash
    make wasm
    ```
4. Run the application
    ```bash
    make start
    ```
   This will start the development server on [localhost:3000](http://localhost:3000).

Alternatively, you can just run `make run` after having installed the dependencies, which does steps 3 and 4 in a single shot.

## Deployment

This project is deployed using [GitHub Actions](https://github.com/features/actions) and served with [GitHub Pages](https://pages.github.com/). 
Every push to the [`main`](https://github.com/grafana/play-thema/tree/main) branch triggers a GitHub Actions workflow, which builds the project and deploys it to the [`gh-pages`](https://github.com/grafana/play-thema/tree/gh-pages) branch.

You can check the [`./github/workflows/deploy.yml`](https://github.com/grafana/play-thema/blob/main/.github/workflows/deploy.yml) file for more details about the deployment process.

## Contributing

Pull requests are welcome. 

For major changes, please [open a GitHub Discussion](https://github.com/grafana/play-thema/discussions) to discuss what you would like to change.
