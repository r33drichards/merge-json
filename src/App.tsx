import { useReducer, useState } from "react";
import "./App.css";
import * as yaml from "js-yaml";

type OutputFormat = "json" | "yaml";

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

function RenderOutput({ 
  data, 
  format 
}: { 
  data: object; 
  format: OutputFormat;
}) {
  const output = format === "json" 
    ? JSON.stringify(data, null, 2)
    : yaml.dump(data, { indent: 2 });
  
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
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");
  const [inputFormat, setInputFormat] = useState<OutputFormat>("json");

  const parseInput = inputFormat === "json" ? handleJsonState : handleYamlState;

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="input-format" style={{ marginRight: "10px" }}>
          Input Format:
        </label>
        <select
          id="input-format"
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value as OutputFormat)}
          style={{ marginRight: "20px" }}
        >
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
        </select>

        <label htmlFor="output-format" style={{ marginRight: "10px" }}>
          Output Format:
        </label>
        <select
          id="output-format"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
        >
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
        </select>
      </div>

      <RenderOutput
        data={
          Object.keys(state)
            .map((i) => state[i]) // get state values for each textarea
            .map(parseInput) // transform to object based on input format
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
