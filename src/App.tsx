import { useReducer, useState } from "react";
import "./App.css";
import * as yaml from "js-yaml";

const handleJsonState = (value: any) => {
  // Try parsing as JSON first
  try {
    return JSON.parse(value);
  } catch (jsonError) {
    // If JSON fails, try parsing as YAML
    try {
      const parsed = yaml.load(value);
      // If parsed is not an object, return empty object
      if (typeof parsed !== "object" || parsed === null) {
        return {};
      }
      return parsed;
    } catch (yamlError) {
      return {};
    }
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

function RenderJSON({ json, format }: { json: object; format: "json" | "yaml" }) {
  const output = format === "yaml"
    ? yaml.dump(json, { indent: 2 })
    : JSON.stringify(json, null, 2);
  return <pre>{output}</pre>;
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
  const [outputFormat, setOutputFormat] = useState<"json" | "yaml">("json");

  return (
    <>
      <div>
        <label>
          Output Format:
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as "json" | "yaml")}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
        </label>
      </div>

      <RenderJSON
        json={
          Object.keys(state)
            .map((i) => state[i]) // get state values for each textarea
            .map(handleJsonState) // transform to json/yaml if possible
            .reduce(mergeObjects, {}) // reduce to merge objects
        }
        format={outputFormat}
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
