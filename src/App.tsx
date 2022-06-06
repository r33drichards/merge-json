import { useReducer } from "react";
import "./App.css";

const handleJsonState = (value: any) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
};

function reducer(state: any, action: (state: any) => any) {
  return action(state);
}

const mergeObjects = (acc: any, currentVal: any) => ({
  ...acc,
  ...currentVal,
});

const textAreaMapper =
  (state: any, dispatch: (state: any) => any) => (idx: number) =>
    (
      <textarea
        onChange={(event) =>
          dispatch((state: any) => ({ ...state, [idx]: event.target.value }))
        }
        value={idx in state ? state[idx] : ""}
      ></textarea>
    );


function RenderJSON({json} :{json: object}){
  return <pre>{JSON.stringify(json, null, " ")}</pre>
}

function MergeJson() {
  const [state, dispatch] = useReducer(reducer, {
    count: 2,
  });

  const stateKeys = Array.from(Array(state.count).keys());

  return (
    <>
    <RenderJSON json={
          stateKeys
          .map((i) => state[i])     // get state values for each textarea
          .map(handleJsonState)     // transform to json if possible
          .reduce(mergeObjects, {}) // reduce to merge json
    } / >

      {/* set dispatch function for each textarea to update state when edited */}
      <div>{stateKeys.map(textAreaMapper(state, dispatch))}</div> 

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
