# TYPESCRIPT

## Backend

### Setting up

- Make a folder and `npm init -y`
- Install typescript package `npm install typescript --save-dev`
- Add to scripts in `package.json` file:

```json
  "scripts": {
    "tsc": "tsc"
  },
```

- Initialize tsconfig.json by: `npm run tsc -- --init`
- Recommend for now for `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

- Install some packages: `npm install express` `npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser` (eslint isnt necessary I think.)
- Create `.eslintrc` file:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

- Install 'nodemon' for typescript: `npm install --save-dev ts-node-dev`
- Add these lines to scripts in `package.json`:

```json
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts ."
  },
```

### Start coding

- Create `index.ts` file:

```ts
import express from "express";
const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- Start server `npm run dev` and go to `http://localhost:3000/ping` to see that everything works
- Test production build: `npm run tsc` (builds to that folder what is the 'outdir' in `tsconfig.json`)
- Add to scripts in `package.json` production mode run

```json
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts .",
    "start": "node build/index.js"
  },
```

- Try that it works with `npm start` and go to `http://localhost:3000/ping`
