import { useReducer } from "react";
import "./App.css";
import MonacoJsonEditor from "./MonacoJsonEditor";

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

const updateEditor = (idx: string, value: string) => (state: any) => ({
  ...state,
  [idx]: value,
});

function RenderJSON({ json }: { json: object }) {
  return (
    <div style={{ 
      backgroundColor: '#1e1e1e', 
      color: '#d4d4d4', 
      padding: '16px', 
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      overflow: 'auto',
      maxHeight: '400px'
    }}>
      <h3 style={{ marginTop: 0, color: '#4ec9b0' }}>Merged JSON Output:</h3>
      <pre style={{ margin: 0 }}>{JSON.stringify(json, null, 2)}</pre>
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

  const mergedJson = Object.keys(state)
    .map((i) => state[i]) // get state values for each editor
    .map(handleJsonState) // transform to json if possible
    .reduce(mergeObjects, {}); // reduce to merge json

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>JSON Merger</h1>
      
      <RenderJSON json={mergedJson} />

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => dispatch((state) => ({ ...state, [newID(state)]: "" }))}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          Add New Editor
        </button>
        <button
          onClick={() => dispatch((_) => initialState)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset All
        </button>
      </div>

      <div>
        <h3>JSON Input Editors:</h3>
        {Object.keys(state).map((idx) => (
          <MonacoJsonEditor
            key={idx}
            value={state[idx]}
            onChange={(value) => dispatch(updateEditor(idx, value))}
            onDelete={() =>
              dispatch((state: any) => {
                let newstate = { ...state };
                delete newstate[idx];
                return newstate;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <MergeJson 
        initialState={{ 
          '1': '{\n  "name": "John",\n  "age": 30\n}',
          '2': '{\n  "city": "New York",\n  "country": "USA"\n}'
        }} 
      />
    </div>
  );
}

export default App;
