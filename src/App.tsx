import { useReducer } from "react";
import Editor from "@monaco-editor/react";
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

const editorChangeHandler =
  (idx: string, dispatch: (state: any) => any) => (value: string | undefined) =>
    dispatch(updateTextArea(idx, value || ""));

const editorMapper =
  (state: any, dispatch: (state: any) => any) => (idx: string) =>
    (
      <div key={idx} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <button
          onClick={() =>
            dispatch((state: any) => {
              let newstate = { ...state };
              delete newstate[idx];
              return newstate;
            })
          }
          style={{ marginBottom: "10px" }}
        >
          delete
        </button>
        <Editor
          height="200px"
          defaultLanguage="json"
          value={state[idx]}
          onChange={editorChangeHandler(idx, dispatch)}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
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

      {/* set dispatch function for each editor to update state when edited */}
      <div>{Object.keys(state).map(editorMapper(state, dispatch))}</div>

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
