export const basic = {
  lineage: `package ship

import "github.com/grafana/thema"

thema.#Lineage
name: "ship"
schemas: [{
	version: [0, 0]
	schema: firstfield: string
}]
lenses: []`,
  input: `{
    "firstfield": "value"
}`,
};

export const multi = {
  lineage: `package ship

import "github.com/grafana/thema"

thema.#Lineage
name: "ship"
schemas: [{
	version: [0, 0]
	schema: firstfield: string
}, {
	version: [0, 1]
	schema:
	{
		firstfield:   string
		secondfield?: int
	}
}]
lenses: []`,
  input: `{
    "firstfield": "value",
    "secondfield": "100"
}`,
};

export const lenses = {
  lineage: `package ship

import "github.com/grafana/thema"

thema.#Lineage
name: "ship"
schemas: [{
	version: [0, 0]
	schema: firstfield: string
}, {
	version: [1, 0]
	schema: {
		firstfield:  string
		secondfield: int // 1.0
	}
}]
lenses: [{
	to: [0, 0]
	from: [1, 0]
	input: _
	result: {
		// Map the first field back
		firstfield: input.firstfield
	}
	lacunas: []
}, {
	to: [1, 0]
	from: [0, 0]
	input: _
	result: {
		// Direct mapping of the first field
		firstfield: input.firstfield
		// Just some placeholder int, so we have a valid instance of schema 1.0
		secondfield: -1
	}
	lacunas: []
}]
`,
  input: `{
    "firstfield": "value"
}`,
};
