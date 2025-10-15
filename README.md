# Installation

To install the required packages, run the following command:

```bash
npm install
```

# Running the Application

## Development Mode

1. To start the application in development mode, use the following command:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost/futura/index.html` to view the application.

## Production Mode

1. To build the application for production, run:

    ```bash
    npm run build
    ```

2. After building, you can serve the production files using a static server. For example, you can use `serve`:

    ```bash
    npx serve dist
    ```

# Building

## Production Build

To create an optimized build of the application, use the following command:

```bash
npm run build
```

# Testing

## Linting

To run tests, use the following command:

```bash
npm lint .
```

To fix linting issues automatically, run:

```bash
npm eslint . --fix
```