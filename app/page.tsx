'use client'

// These styles apply to every route in the application
import './globals.css'

import React, { useReducer } from 'react';


interface State {
  count: number;
  lambdaResponse: any; // Adjust the type according to the expected response from your lambda
}

type CounterAction =
  | { type: 'reset' }
  | { type: 'setCount'; value: State['count'] }
  | { type: 'setLambdaResponse'; value: any }; // Adjust the type according to the expected response from your lambda

const initialState: State = { count: 0, lambdaResponse: null };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setCount':
      return { ...state, count: action.value };
    case 'setLambdaResponse':
      return { ...state, lambdaResponse: action.value };
    default:
      throw new Error('Unknown action');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const fetchFromLambda = () => {
    fetch('https://pgrmlvy9ol.execute-api.us-east-1.amazonaws.com/default/myFirstLambda')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        dispatch({ type: 'setLambdaResponse', value: data });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const addFive = () => dispatch({ type: 'setCount', value: state.count + 5 });
  const reset = () => dispatch({ type: 'reset' });

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Welcome to my first web app</h1>

      <div className="mb-4">
        <p className="text-lg">Count: {state.count}</p>
        <p className="text-lg">Response from the server: {state.lambdaResponse}</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addFive}
        >
          Add 5
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={reset}
        >
          Reset
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchFromLambda}
        >
          Fetch from lambda
        </button>
      </div>
    </div>
  );
}
