import { useReducer, useState } from "react";
import "./App.css";
import * as yaml from "js-yaml";

const handleJsonState = (value: any) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
};

const handleYamlState = (value: any) => {
  try {
    return yaml.load(value) as object;
  } catch (e) {
    return {};
  }
};

const handleState = (value: any, format: "json" | "yaml") => {
  if (format === "yaml") {
    return handleYamlState(value);
  }
  return handleJsonState(value);
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
  (idx: string, dispatch: (state: any) => any) => (event: any) =>
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
          onChange={textAreaEventHandler(idx, dispatch)}
          value={state[idx]}
        ></textarea>
      </>
    );

function newID(state: any): string {
  let num = Math.random() + "";
  while (num in state) {
    num = Math.random() + "";
  }
  return num;
}

function MergeJson({ initialState }: { initialState: any }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [format, setFormat] = useState<"json" | "yaml">("json");
  const [outputFormat, setOutputFormat] = useState<"json" | "yaml">("json");

  const mergedObject = Object.keys(state)
    .map((i) => state[i]) // get state values for each textarea
    .map((val) => handleState(val, format)) // transform to json/yaml if possible
    .reduce(mergeObjects, {}); // reduce to merge objects

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Input Format:{" "}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "json" | "yaml")}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
        </label>
        {" | "}
        <label>
          Output Format:{" "}
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as "json" | "yaml")}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Merged Output:</h3>
        <pre>
          {outputFormat === "json"
            ? JSON.stringify(mergedObject, null, 2)
            : yaml.dump(mergedObject)}
        </pre>
      </div>

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
