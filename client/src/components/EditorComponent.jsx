import Editor from "@monaco-editor/react";

function EditorComponent({ code, setCode, language }) {
  return (
    <Editor
      height="400px"
      theme="vs-dark"
      language={language}
      value={code}
      onChange={(value) => setCode(value)}
    />
  );
}

export default EditorComponent;
