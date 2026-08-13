"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function KeywordInput({
  keywords,
  onKeywordsChange,
  placeholder = "Add the keywords or paste them separated by commas",
  disabled,
}: KeywordInputProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const displayLimit = 10;
  const displayedKeywords = isExpanded ? keywords : keywords.slice(0, displayLimit);
  const hiddenCount = keywords.length - displayLimit;

  const handleKeywordKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newKeywords = keywordInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0 && !keywords.includes(k));

      if (newKeywords.length > 0) {
        const uniqueNewKeywords = Array.from(new Set(newKeywords));
        onKeywordsChange([...keywords, ...uniqueNewKeywords]);
        setKeywordInput("");
      } else {
        setKeywordInput("");
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onKeywordsChange(keywords.filter((k) => k !== keywordToRemove));
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder={placeholder}
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onKeyDown={handleKeywordKeyDown}
        disabled={disabled}
        className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[14px] text-cyber-body focus:border-neon focus:outline-none transition-colors disabled:opacity-50"
      />
      
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayedKeywords.map((keyword) => (
            <span 
              key={keyword} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-cyber-border bg-cyber-surface text-[12px] font-medium text-cyber-heading"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="text-cyber-body-subtle hover:text-[#FF3366] transition-colors focus:outline-none"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {!isExpanded && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center px-2.5 py-1 rounded-sm border border-cyber-border-subtle bg-cyber-surface-active text-[12px] font-medium text-cyber-body hover:text-neon hover:border-neon/50 transition-colors focus:outline-none"
            >
              +{hiddenCount} more
            </button>
          )}

          {isExpanded && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center px-2.5 py-1 rounded-sm border border-cyber-border-subtle bg-cyber-surface-active text-[12px] font-medium text-cyber-body hover:text-neon hover:border-neon/50 transition-colors focus:outline-none"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default KeywordInput;
