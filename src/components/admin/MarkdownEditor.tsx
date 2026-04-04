import { useState, useEffect, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  height?: number;
}

export default function MarkdownEditor({
  initialValue = "",
  onChange,
  height = 500,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (val?: string) => {
      const newValue = val ?? "";
      setValue(newValue);
      onChange?.(newValue);

      // Sync to hidden textarea for form submission
      const textarea = document.getElementById(
        "post-content"
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.value = newValue;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    [onChange]
  );

  // Sync initial value from textarea (for edit page restore)
  useEffect(() => {
    const textarea = document.getElementById(
      "post-content"
    ) as HTMLTextAreaElement | null;
    if (textarea && textarea.value && textarea.value !== initialValue) {
      setValue(textarea.value);
    }
  }, [initialValue]);

  return (
    <div data-color-mode="auto">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}
