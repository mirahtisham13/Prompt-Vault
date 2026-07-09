import { Fragment } from 'react';

export default function PromptFormatter({ text }: { text: string }) {
  if (!text) return null;
  
  // Split by brackets, e.g., "Hello [name]" -> ["Hello ", "[name]", ""]
  const parts = text.split(/(\[[^\]]+\])/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return <span key={i} className="prompt-variable">{part}</span>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
