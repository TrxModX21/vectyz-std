"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

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

  const handleKeywordKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
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
    <div className="space-y-2">
      <Textarea
        className="resize-none"
        placeholder={placeholder}
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onKeyDown={handleKeywordKeyDown}
        disabled={disabled}
      />
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Badge key={keyword} variant="secondary">
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="ml-1 hover:text-destructive"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
