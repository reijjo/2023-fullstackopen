# 2023-fullstackopen

fullstackopen

# VITE

## Create project

npm create vite@latest [PROJECT NAME] -- --template react
cd [PROJECT NAME]
npm install
npm run dev

### main.jsx

```jsx
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

### App.jsx

```jsx
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  );
};

export default App;
```

### remove App.css and index.css files and assets folder

### Add a rule to eslintrc.cjs

```cjs
'react/prop-types': false
```

# Country API

`https://studies.cs.helsinki.fi/restcountries/`
