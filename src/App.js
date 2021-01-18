import React, { useState, useEffect } from "react";
import "./App.scss";


function DecrementButton(props) {
          return (
          <div 
            className="btn" 
            data-testid="decrement"  
            onClick={props.onClickFunction}>
               -
            </div>
               )
}

function IncrementButton(props) {
          return (
          <div
            className="btn"
            data-testid="increment"
            onClick={props.onClickFunction}
          >
            +
          </div>
          )
}

function SubmitButton(props) {
  return (
        <button type="submit" 
          data-testid="submit" 
          disabled={props.count > 20 || props.count < -10 ? true : false} 
          onClick={props.onSubmitFunction}
        >
          click me
        </button>
  )
}

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); 
  const submit = async () => {
    await fetch("http://localhost:3002/count", {
      method: "POST",
      body: JSON.stringify(count),
    })
    console.log('submitted: ' + count)
    checkCount()
  };
  const fetchData = () => {
    // fetch("http://localhost:3002/count", {})
    submit()
    .then(response => response.json())
    .then(count => setCount(count))
    .catch(error => console.log(error))

    setTimeout(() => {
      setLoading(false);
      //setCount(count);
    }, 1500);
    checkCount()
  }

  useEffect(() => {
    fetchData()
    // setSuccess(false)
    // setLoading(false);
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
          <DecrementButton onClickFunction={decrementCount} />
          <span data-testid="count-value">{count}</span>
          <IncrementButton onClickFunction={incrementCount}/>
        </div>
        <SubmitButton onSubmitFunction={submit}/>
        {error && (
          <span className="error" 
          data-testid="error">
            There was an error submitted your count!
          </span>
          )}
        {success && (
          <span className="success" 
          data-testid="success">
          Count submitted
          </span>
          )}
      
      </div>
     }
    
    </div>
  );
}

export default App;
