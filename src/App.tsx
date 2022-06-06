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

const updateTextArea = (idx: string, value: string) => (state: any) => ({
  ...state,
  [idx]: value,
});

const textAreaEventHandler =
  (event: any) => (idx: string, dispatch: (state: any) => any) =>
    dispatch(updateTextArea(idx, event.target.value));

const textAreaMapper =
  (state: any, dispatch: (state: any) => any) => (idx: string) =>
    (
      <>
        <button
          onClick={() =>
            dispatch((state: any) => {
              let newstate = { ...state };
              delete newstate[idx];
              return newstate;
            })
          }
        >
          delete
        </button>
        <textarea
          onChange={(event) => textAreaEventHandler(event)(idx, dispatch)}
          value={state[idx]}
        ></textarea>
      </>
    );

function RenderJSON({ json }: { json: object }) {
  return <pre>{JSON.stringify(json, null, " ")}</pre>;
}

function newID(state: any): string {
  let num = Math.random() + "";
  while (num in state) {
    num = Math.random() + "";
  }
  return num;
}

function MergeJson({ initialState }: { initialState: any }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <RenderJSON
        json={
          Object.keys(state)
            .map((i) => state[i]) // get state values for each textarea
            .map(handleJsonState) // transform to json if possible
            .reduce(mergeObjects, {}) // reduce to merge json
        }
      />

      {/* set dispatch function for each textarea to update state when edited */}
      <div>{Object.keys(state).map(textAreaMapper(state, dispatch))}</div>

      <button onClick={() => dispatch((_) => initialState)}>reset</button>
      <button
        onClick={() => dispatch((state) => ({ ...state, [newID(state)]: "" }))}
      >
        new
      </button>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <MergeJson initialState={{ foo: "", bar: "" }} />
    </div>
  );
}

export default App;
