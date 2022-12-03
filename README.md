[![master build status](https://github.com/iwharris/aoc/actions/workflows/build.yaml/badge.svg?branch=master)](https://github.com/iwharris/aoc/actions/workflows/build.yaml)

# aoc

Advent of Code solutions

## Development

Clone the repository:

```bash
git clone git@github.com:iwharris/aoc.git
```

Run the CLI, skipping compilation:

```bash
# See usage instructions for the CLI
npm run dev

# To solve a challenge with an input file
npm run dev solve 2022.1 < input/2022.1.txt
```

Run the CLI by compiling and then executing the compiled JS:

```bash
npm run compile

# Then, run through npm
npm run aoc solve 2022.1 < input/2022.1.txt

# Or run with node:
node dist/src/index.js solve 2022.1 < input/2022.1.txt
```

## Code Style

Using `prettier` and `eslint`, check that files are formatted properly:

```bash
# Run prettier and eslint
npm run lint

# To run prettier and eslint individually
npm run prettier
npm run eslint
```

To automatically fix formatting:

```bash
npm run lint:fix
```

## Testing

Run the test suite:

```bash
npm test
```

Generate a coverage report:

```bash
npm run test:coverage
```
