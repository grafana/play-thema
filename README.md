# Thema Playground

Thema Playground is an online service that provides a safe and sandboxed environment for users to write and execute [Thema](https://github.com/grafana/thema) code. Accessible via a web browser at [grafana.github.io/play-thema](https://grafana.github.io/play-thema), it eliminates the need for users to install [Thema](https://github.com/grafana/thema) on their personal computers.

It is primarily designed for sharing and executing Thema snippets. 
It allows you to write Thema code, compile, and run it, with the output being displayed directly within the web interface. 
It's a particularly valuable tool for demonstrating the behavior of Thema code, seeking assistance with Thema-related challenges, or learning the intricacies of the Thema language, including its [operations](https://github.com/grafana/thema/blob/main/docs/overview.md#about-thema-operations).


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
3. Build the WASM artifact from the Go source code
    ```bash
    make wasm
    ```
4. Run the application
    ```bash
    make start
    ```
   This will start the development server on [localhost:3000](http://localhost:3000).

Alternatively, after installing the necessary dependencies, you can run `make run`. This command performs steps 3 and 4 in a single operation.


## Deployment

This project is deployed using [GitHub Actions](https://github.com/features/actions) and served with [GitHub Pages](https://pages.github.com/). 
Every push to the [`main`](https://github.com/grafana/play-thema/tree/main) branch triggers a GitHub Actions workflow, which builds the project and deploys it to the [`gh-pages`](https://github.com/grafana/play-thema/tree/gh-pages) branch.

You can check the [`./github/workflows/deploy.yml`](https://github.com/grafana/play-thema/blob/main/.github/workflows/deploy.yml) file for more details about the deployment process.

## Contributing

Pull requests are welcome. 

For major changes, please [open a GitHub Discussion](https://github.com/grafana/play-thema/discussions) to discuss what you would like to change.
