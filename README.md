[![master build status](https://github.com/iwharris/aoc/actions/workflows/build.yaml/badge.svg?branch=master)](https://github.com/iwharris/aoc/actions/workflows/build.yaml)

# aoc

Advent of Code solutions

## Development

Clone the repository:

```bash
git clone git@github.com:iwharris/aoc.git
```

Lint, format, and compile typescript:

```bash
npm run build
```

Run the CLI:

```bash
npm run dev
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
