import { useReducer } from "react";
import "./App.css";

function handleJsonState(value: any) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

function reducer(state: any, action: (state: any) => any) {
  return action(state);
}

// TODO: this is a little annoying because it relies on passing in state to 
// create the reducer function. for the list of state id's, should 
// map handleJsonState(state[currentVal]) then reduce to merge json.
const mergeJsonNaiveREducer = (state: any) => (acc: any, currentVal: any) => ({
  ...acc,
  ...handleJsonState(state[currentVal]),
});

function MergeJson() {
  const [state, dispatch] = useReducer(reducer, {
    count: 2,
  });

  const stateKeys = Array.from(Array(state.count).keys());

  return (
    <>
      <pre>
        {JSON.stringify(
          stateKeys.reduce(mergeJsonNaiveREducer(state), {}),
          null,
          "  "
        )}
      </pre>
      <div>
        {stateKeys.map((idx) => (
          <textarea
            onChange={(event) =>
              dispatch((state) => ({ ...state, [idx]: event.target.value }))
            }
            value={idx in state ? state[idx] : ""}
          ></textarea>
        ))}
      </div>
      <button onClick={() => dispatch((_) => ({ count: 2 }))}>reset</button>

      <button
        onClick={() =>
          dispatch((state) => ({
            ...state,
            count: Math.max(state.count - 1, 0),
          }))
        }
      >
        -
      </button>
      <button
        onClick={() =>
          dispatch((state) => ({ ...state, count: state.count + 1 }))
        }
      >
        +
      </button>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <MergeJson />
    </div>
  );
}

export default App;
