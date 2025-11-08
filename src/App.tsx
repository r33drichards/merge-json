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

const updateEditor = (idx: string, value: string | undefined) => (state: any) => ({
  ...state,
  [idx]: value || "",
});

const editorChangeHandler =
  (idx: string, dispatch: (state: any) => any) => (value: string | undefined) =>
    dispatch(updateEditor(idx, value));

const editorMapper =
  (state: any, dispatch: (state: any) => any) => (idx: string) =>
    (
      <div key={idx} className="editor-wrapper">
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
          🗑️ Delete
        </button>
        <Editor
          height="200px"
          defaultLanguage="json"
          value={state[idx]}
          onChange={editorChangeHandler(idx, dispatch)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    );

function RenderJSON({ json }: { json: object }) {
  return (
    <div className="merged-result">
      <h2>📋 Merged Result</h2>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
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
      <h1>🔗 JSON Merger</h1>
      
      <RenderJSON
        json={
          Object.keys(state)
            .map((i) => state[i]) // get state values for each editor
            .map(handleJsonState) // transform to json if possible
            .reduce(mergeObjects, {}) // reduce to merge json
        }
      />

      {/* set dispatch function for each editor to update state when edited */}
      <div className="editors-container">
        {Object.keys(state).map(editorMapper(state, dispatch))}
      </div>

      <div className="controls">
        <button onClick={() => dispatch((_) => initialState)}>
          🔄 Reset
        </button>
        <button
          onClick={() => dispatch((state) => ({ ...state, [newID(state)]: "" }))}
        >
          ➕ Add New Editor
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <MergeJson 
        initialState={{ 
          foo: '{\n  "name": "John",\n  "age": 30\n}', 
          bar: '{\n  "age": 31,\n  "city": "New York"\n}' 
        }} 
      />
    </div>
  );
}

export default App;
