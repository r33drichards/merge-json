import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("MergeJson Component", () => {
  test("renders the app without crashing", () => {
    render(<App />);
  });

  test("renders input format selector", () => {
    render(<App />);
    const inputFormatSelector = screen.getByLabelText(/input format/i);
    expect(inputFormatSelector).toBeInTheDocument();
    expect(inputFormatSelector).toHaveValue("json");
  });

  test("renders output format selector", () => {
    render(<App />);
    const outputFormatSelector = screen.getByLabelText(/output format/i);
    expect(outputFormatSelector).toBeInTheDocument();
    expect(outputFormatSelector).toHaveValue("json");
  });

  test("renders initial textareas", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(2); // foo and bar initial textareas
  });

  test("renders reset button", () => {
    render(<App />);
    const resetButton = screen.getByRole("button", { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
  });

  test("renders new button", () => {
    render(<App />);
    const newButton = screen.getByRole("button", { name: /new/i });
    expect(newButton).toBeInTheDocument();
  });

  test("renders delete buttons for each textarea", () => {
    render(<App />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2); // one for each initial textarea
  });
});

describe("JSON Merge Functionality", () => {
  test("merges two JSON objects correctly", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Input JSON in first textarea
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John", "age": 30}' },
    });
    
    // Input JSON in second textarea
    fireEvent.change(textareas[1], {
      target: { value: '{"city": "New York", "country": "USA"}' },
    });

    // Check that merged output is displayed
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("name");
    expect(output?.textContent).toContain("John");
    expect(output?.textContent).toContain("age");
    expect(output?.textContent).toContain("30");
    expect(output?.textContent).toContain("city");
    expect(output?.textContent).toContain("New York");
    expect(output?.textContent).toContain("country");
    expect(output?.textContent).toContain("USA");
  });

  test("later objects override earlier objects in merge", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Input JSON with same key
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John", "age": 30}' },
    });
    
    fireEvent.change(textareas[1], {
      target: { value: '{"name": "Jane", "city": "Boston"}' },
    });

    // The second object should override the name
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("Jane");
    expect(output?.textContent).not.toContain("John");
    expect(output?.textContent).toContain("age");
    expect(output?.textContent).toContain("30");
    expect(output?.textContent).toContain("city");
    expect(output?.textContent).toContain("Boston");
  });

  test("handles invalid JSON gracefully", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Input invalid JSON
    fireEvent.change(textareas[0], {
      target: { value: 'invalid json {{{' },
    });
    
    // Input valid JSON in second textarea
    fireEvent.change(textareas[1], {
      target: { value: '{"city": "New York"}' },
    });

    // Should still render something (the valid JSON)
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("city");
    expect(output?.textContent).toContain("New York");
  });

  test("handles empty textareas", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Leave textareas empty
    fireEvent.change(textareas[0], {
      target: { value: "" },
    });
    
    fireEvent.change(textareas[1], {
      target: { value: "" },
    });

    // Should render empty object
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("{}");
  });
});

describe("YAML Merge Functionality", () => {
  test("merges two YAML objects correctly", () => {
    render(<App />);
    
    // Switch input format to YAML
    const inputFormatSelector = screen.getByLabelText(/input format/i);
    fireEvent.change(inputFormatSelector, { target: { value: "yaml" } });
    
    const textareas = screen.getAllByRole("textbox");
    
    // Input YAML in first textarea
    fireEvent.change(textareas[0], {
      target: { value: "name: John\nage: 30" },
    });
    
    // Input YAML in second textarea
    fireEvent.change(textareas[1], {
      target: { value: "city: New York\ncountry: USA" },
    });

    // Check that merged output is displayed (in JSON by default)
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("name");
    expect(output?.textContent).toContain("John");
    expect(output?.textContent).toContain("age");
    expect(output?.textContent).toContain("30");
    expect(output?.textContent).toContain("city");
    expect(output?.textContent).toContain("New York");
    expect(output?.textContent).toContain("country");
    expect(output?.textContent).toContain("USA");
  });

  test("handles invalid YAML gracefully", () => {
    render(<App />);
    
    // Switch input format to YAML
    const inputFormatSelector = screen.getByLabelText(/input format/i);
    fireEvent.change(inputFormatSelector, { target: { value: "yaml" } });
    
    const textareas = screen.getAllByRole("textbox");
    
    // Input invalid YAML
    fireEvent.change(textareas[0], {
      target: { value: "invalid: yaml: : :" },
    });
    
    // Input valid YAML in second textarea
    fireEvent.change(textareas[1], {
      target: { value: "city: Boston" },
    });

    // Should still render something (the valid YAML)
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("city");
    expect(output?.textContent).toContain("Boston");
  });
});

describe("Format Switching", () => {
  test("switches output format from JSON to YAML", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Input JSON
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John"}' },
    });

    // Initially renders as JSON (with braces)
    let output = document.querySelector("pre");
    expect(output?.textContent).toContain("{");
    expect(output?.textContent).toContain("}");
    
    // Switch output format to YAML
    const outputFormatSelector = screen.getByLabelText(/output format/i);
    fireEvent.change(outputFormatSelector, { target: { value: "yaml" } });

    // Should now render as YAML (with colon, no braces)
    output = document.querySelector("pre");
    expect(output?.textContent).toContain("name: John");
    expect(output?.textContent).not.toContain("{");
  });

  test("switches input format from JSON to YAML", () => {
    render(<App />);
    
    const inputFormatSelector = screen.getByLabelText(/input format/i);
    
    // Initial format is JSON
    expect(inputFormatSelector).toHaveValue("json");
    
    // Switch to YAML
    fireEvent.change(inputFormatSelector, { target: { value: "yaml" } });
    expect(inputFormatSelector).toHaveValue("yaml");
    
    // Switch back to JSON
    fireEvent.change(inputFormatSelector, { target: { value: "json" } });
    expect(inputFormatSelector).toHaveValue("json");
  });

  test("renders YAML output correctly", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    // Input JSON
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John", "age": 30}' },
    });
    
    fireEvent.change(textareas[1], {
      target: { value: '{"city": "Boston"}' },
    });

    // Switch output format to YAML
    const outputFormatSelector = screen.getByLabelText(/output format/i);
    fireEvent.change(outputFormatSelector, { target: { value: "yaml" } });

    // Should render as YAML
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("name: John");
    expect(output?.textContent).toContain("age: 30");
    expect(output?.textContent).toContain("city: Boston");
  });
});

describe("UI Interactions", () => {
  test("adds new textarea when new button is clicked", () => {
    render(<App />);
    
    let textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(2);
    
    // Click new button
    const newButton = screen.getByRole("button", { name: /new/i });
    fireEvent.click(newButton);
    
    // Should now have 3 textareas
    textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(3);
  });

  test("deletes textarea when delete button is clicked", () => {
    render(<App />);
    
    let textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(2);
    
    // Click first delete button
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Should now have 1 textarea
    textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(1);
  });

  test("reset button restores initial state", () => {
    render(<App />);
    
    // Add some content
    const textareas = screen.getAllByRole("textbox");
    fireEvent.change(textareas[0], {
      target: { value: '{"test": "data"}' },
    });
    
    // Add a new textarea
    const newButton = screen.getByRole("button", { name: /new/i });
    fireEvent.click(newButton);
    
    let allTextareas = screen.getAllByRole("textbox");
    expect(allTextareas).toHaveLength(3);
    
    // Click reset button
    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);
    
    // Should be back to 2 textareas with empty values
    allTextareas = screen.getAllByRole("textbox");
    expect(allTextareas).toHaveLength(2);
    expect(allTextareas[0]).toHaveValue("");
    expect(allTextareas[1]).toHaveValue("");
  });

  test("textarea content updates when typed", () => {
    render(<App />);
    
    const textareas = screen.getAllByRole("textbox");
    const testValue = '{"key": "value"}';
    
    fireEvent.change(textareas[0], {
      target: { value: testValue },
    });
    
    expect(textareas[0]).toHaveValue(testValue);
  });
});

describe("Output Rendering", () => {
  test("renders output in pre tag", () => {
    render(<App />);
    const preElement = document.querySelector("pre");
    expect(preElement).toBeInTheDocument();
  });

  test("JSON output is properly formatted with indentation", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John", "age": 30}' },
    });

    const preElement = document.querySelector("pre");
    // JSON.stringify with indent 2 should create multiline output
    expect(preElement?.textContent).toContain("\n");
    expect(preElement?.textContent).toContain("  "); // Check for indentation
  });

  test("YAML output is properly formatted", () => {
    render(<App />);
    const textareas = screen.getAllByRole("textbox");
    
    fireEvent.change(textareas[0], {
      target: { value: '{"name": "John", "age": 30}' },
    });

    // Switch to YAML output
    const outputFormatSelector = screen.getByLabelText(/output format/i);
    fireEvent.change(outputFormatSelector, { target: { value: "yaml" } });

    const preElement = document.querySelector("pre");
    // YAML format should have key: value pairs
    expect(preElement?.textContent).toMatch(/\w+:\s+\w+/);
  });

  test("empty merge results in empty object display", () => {
    render(<App />);
    
    // Textareas start empty by default
    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("{}");
  });

  test("merge of three objects renders correctly", () => {
    render(<App />);
    
    // Add a third textarea
    const newButton = screen.getByRole("button", { name: /new/i });
    fireEvent.click(newButton);
    
    const textareas = screen.getAllByRole("textbox");
    
    fireEvent.change(textareas[0], {
      target: { value: '{"a": 1}' },
    });
    
    fireEvent.change(textareas[1], {
      target: { value: '{"b": 2}' },
    });
    
    fireEvent.change(textareas[2], {
      target: { value: '{"c": 3}' },
    });

    const output = document.querySelector("pre");
    expect(output?.textContent).toContain("a");
    expect(output?.textContent).toContain("1");
    expect(output?.textContent).toContain("b");
    expect(output?.textContent).toContain("2");
    expect(output?.textContent).toContain("c");
    expect(output?.textContent).toContain("3");
  });
});
