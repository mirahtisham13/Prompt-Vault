import { Fragment } from 'react';

export default function PromptFormatter({ text, values }: { text: string, values?: Record<string, string> }) {
  if (!text) return null;
  
  // Split by brackets, e.g., "Hello [name]" -> ["Hello ", "[name]", ""]
  const parts = text.split(/(\[[^\]]+\])/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          const varName = part.slice(1, -1);
          const customVal = values?.[varName];
          if (customVal) {
            return <span key={i} className="prompt-variable filled">{customVal}</span>;
          }
          return <span key={i} className="prompt-variable">{part}</span>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
