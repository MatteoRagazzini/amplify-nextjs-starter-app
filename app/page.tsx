'use client'

// These styles apply to every route in the application
import './globals.css'

import React, { useReducer } from 'react';


interface State {
  count: number;
  lambdaResponse: any; // Adjust the type according to the expected response from your lambda
  lambdaImage: any; // Adjust the type according to the expected response from your lambda
}

type CounterAction =
    | { type: 'reset' }
    | { type: 'setCount'; value: State['count'] }
    | { type: 'setLambdaResponse'; value: any } // Adjust the type according to the expected response from your lambda
    | { type: 'setLambdaImageResponse'; value: any }; // Adjust the type according to the expected response from your lambda

const initialState: State = { count: 0, lambdaResponse: null, lambdaImage: null };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setCount':
      return { ...state, count: action.value };
    case 'setLambdaResponse':
      return { ...state, lambdaResponse: action.value };
    case 'setLambdaImageResponse':
      return { ...state, lambdaImage: action.value };
    default:
      throw new Error('Unknown action');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const fetchFromLambdaText = () => {
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

  const fetchFromLambdaImg = () => {
    fetch('https://5rgsu1pvth.execute-api.us-east-1.amazonaws.com/default/S3imageRetrieval')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => {
          dispatch({ type: 'setLambdaImageResponse', value: data });
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
          </div>
          <div className="mb-4">
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={fetchFromLambdaText}
            >
              Fetch secret message
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={fetchFromLambdaImg}
            >
              Fetch secret image
            </button>
            <p className="text-lg">message: {state.lambdaResponse}</p>
            <p className="text-lg">Image:</p>
            {state.lambdaImage && (
                <img
                    src={`data:image/png;base64,${state.lambdaImage}`}
                    alt="Fetched from Lambda"
                    className="max-w-full h-auto"
                />
            )}
          </div>
        </div>
      </div>
  );
}
