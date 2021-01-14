import React, { useState, useEffect } from "react";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); 
  const submit = () => {
    fetch("http://localhost:3002/count", {
      method: "POST",
      body: JSON.stringify(count),
    })
    console.log('submitted: ' + count)
    checkCount()
  };

  useEffect(() => {
    // @note: fetch initial count here!
    (async () => {
      const response = await fetch('http://localhost:3002/initcount', {method: 'POST'})
      if(!response.ok){
        setLoading(false);
        return;
      }
      const initcount = await response.json();
        setTimeout(() => {
        setLoading(false);
        setCount(initcount);
      }, 1000);
    })();
  }, []);

  
  useEffect(() => {
      setSuccess(false)
      setError(false);
  },[count])

const checkCount = () => {
    if(count < 0){
      setError(true);
      setSuccess(false)
    } else {
      setSuccess(true)
      setError(false);
    }
}

const incrementCount = () => {
  setCount((count) => count + 1);
}
const decrementCount = () => {
  setCount((count) => count - 1);
}
  return (
    <div className="app" data-testid="app">
     {loading ? <pre>Loading...</pre> :
      <div className="container">
        <div className="counter">
          <div className="btn" 
               data-testid="decrement"  
               onClick={decrementCount}>
               -
               </div>
          <span data-testid="count-value">{count}</span>
          <div
            className="btn"
            data-testid="increment"
            onClick={incrementCount}
          >
            +
          </div>
        </div>
        <button type="submit" 
        data-testid="submit" 
        disabled={count > 20 || count < -10 ? true : false} 
        onClick={submit}
        >
          click me
        </button>
        {error && (
          <span className="error" data-testid="error">
            There was an error submitted your count!
          </span>
        )}
        {success && <span className="success" data-testid="success">Count submitted</span>}
      
      </div>
     }
    
    </div>
  );
}

export default App;
