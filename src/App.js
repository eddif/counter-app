import React, { useState, useEffect } from "react";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); 
  // const submit = () => {
  //   fetch("http://localhost:3002/count", {
  //     method: "POST",
  //     body: JSON.stringify(`${count}`),
  //   })
  //   console.log('submitted: ' + count)
  //   checkCount()
  // };
  const loadData = () => {
    fetch("http://localhost:3002/count", {
      method: "POST",
      body: JSON.stringify(count),
    })
    setTimeout(() => {
      setLoading(false);
      setCount(count);
    }, 600);
    checkCount()
  }

  useEffect(() => {
    //loadData()
    // setSuccess(false)
    setLoading(false);
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
        onClick={loadData}
        
        >
          click me
        </button>
        {error && (
          <span className="error" 
          data-testid="error">
            There was an error submitted your count!
          </span>
        )}
        {success && <span className="success" 
        data-testid="success">Count submitted</span>}
      
      </div>
     }
    
    </div>
  );
}

export default App;
