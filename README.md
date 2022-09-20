# useWhyUpdate

A React hook for let you kown the reason of you component update.

# Motivation

Most of other similar hooks can only trace the updates caused by `props`, which is often not enough.

And by using fiber to get data, this hook can tell you all the reasons for a component update.

# Installation

```
pnpm install use-why-update
```

# Usage

```tsx
import { useState, useEffect } from "react";
import useWhyUpdate from "use-why-update";

function App() {
  const [name, setName] = useState("world");
  useWhyUpdate("App");
  useEffect(() => {
    setName("alan");
  }, []);

  return <p>hello {name}</p>;
}
```
