import React, { useState, useEffect } from "react";
import "./App.scss";

const App = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const submit = () => {
    fetch("http://localhost:3002/count", {
      method: "POST",
      body: JSON.stringify(count),
    });
    count < 0 ? setError(true) : setSuccess(true);
  };

  const fetchCount = async () => {
    await fetch("http://localhost:3002/count")
      .then((response) => response.json())
      .then((data) => setCount(data))
      .catch((error) => console.log("Error:", error));
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    setSuccess(false);
    setError(false);
  }, [count]);

  const setCountValue = (value) => () => {
    setCount(value);
  };

  return (
    <div className='app' data-testid='app'>
      {loading ? (
        <pre>Loading...</pre>
      ) : (
        <div className='container'>
          <div className='counter'>
            <div
              className='btn'
              data-testid='decrement'
              onClick={setCountValue(count - 1)}
            >
              -
            </div>
            <span data-testid='count-value'>{count}</span>
            <div
              className='btn'
              data-testid='increment'
              onClick={setCountValue(count + 1)}
            >
              +
            </div>
          </div>
          <button
            type='submit'
            data-testid='submit'
            disabled={count > 20 || count < -10 ? true : false}
            onClick={submit}
          >
            submit
          </button>
          <button type='reset' data-testid='reset' onClick={setCountValue(0)}>
            reset
          </button>

          {error && (
            <span className='error' data-testid='error'>
              There was an error submitted your count!
            </span>
          )}
          {success && (
            <span className='success' data-testid='success'>
              Count submitted
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
