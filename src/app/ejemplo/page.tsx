"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  const incrementTwiceWrong = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementTwiceWrong}>Increment Twice (Wrong)</button>
    </div>
  );
}

export default Counter;
