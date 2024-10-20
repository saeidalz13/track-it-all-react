import { Editor } from "@monaco-editor/react";

interface CodeEditorSegmentProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditorSegment: React.FC<CodeEditorSegmentProps> = ({
  code,
  language,
  onChange,
}) => {
  return (
    <Editor
      height="70vh"
      // width="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{
        selectOnLineNumbers: true,
        minimap: { enabled: false },
        fontSize: 14,
        padding: {
          bottom: 15,
          top: 15
        }
      }}
    />
  );
};

export default CodeEditorSegment;
