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

function MergeJson() {
  const [state, dispatch] = useReducer(reducer, {
    count: 2,
  });
  return (
    <>
      <pre>
        {JSON.stringify(
          Array.from(Array(state.count).keys()).reduce(
            (acc: any, currentVal: any) => ({
              ...acc,
              ...handleJsonState(state[currentVal]),
            }),
            {}
          ),
          null,
          "  "
        )}
      </pre>
      <div>
        {Array.from(Array(state.count).keys()).map((idx) => (
          <textarea
            onChange={(event) =>
              dispatch((state) => {
                return { ...state, [idx]: event.target.value };
              })
            }
            value={idx in state ? state[idx] : ""}
          ></textarea>
        ))}
      </div>
      <button onClick={() => dispatch((_) => ({ count: 2 }))}>reset</button>

      <button
        onClick={() =>
          dispatch((state) => ({ ...state, count: Math.max(state.count - 1) }))
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
  // Declare a new state variable, which we'll call "count"
  return (
    <div className="App">
      <MergeJson />
    </div>
  );
}

export default App;
