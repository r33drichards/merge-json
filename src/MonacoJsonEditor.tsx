import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({ value, onChange, onDelete }) => {
  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <div style={{ 
        padding: '8px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onDelete}
          style={{
            padding: '4px 12px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Delete
        </button>
      </div>
      <Editor
        height="200px"
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          tabSize: 2,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default MonacoJsonEditor;
