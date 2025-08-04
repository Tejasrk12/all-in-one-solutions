import React, { useState } from "react";

export default function Home(){
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSentenceCase = () => {
    const sentenceCased = text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(sentenceCased);
  };

  const handleLowerCase = () => {
    setText(text.toLowerCase());
  };

  const handleUpperCase = () => {
    setText(text.toUpperCase());
  };

  const handleCapitalizedCase = () => {
    const capitalized = text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setText(capitalized);
  };

  const handleTitleCase = () => {
    const minorWords = [
      "a", "an", "and", "as", "at", "but", "by", "for",
      "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet",
    ];

    const titleCased = text
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (index === 0 || !minorWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(" ");

    setText(titleCased);
  };

  const handleClear = () => {
    setText("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (text.trim() !== "") {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleRemoveWhitespace = () => {
    const cleaned = text
        .replace(/\s+/g, " ") // multiple spaces to single space
        .replace(/^\s+|\s+$/g, ""); // remove leading/trailing spaces
    setText(cleaned);
   };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  return (
    <div className="max-w-5xl mx-auto py-20 px-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Text Formatter</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-60 p-3 border border-gray-300 rounded-md resize-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button onClick={handleSentenceCase} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"> Sentence Case </button>
        <button onClick={handleLowerCase} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"> lower case </button>
        <button onClick={handleUpperCase} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"> UPPER CASE </button>
        <button onClick={handleCapitalizedCase} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"> Capitalized </button>
        <button onClick={handleTitleCase} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"> Title Case </button>
        <button onClick={handleCopy} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"> {copied ? "Copied!" : "Copy"} </button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"> Clear </button>
        <button onClick={handleRemoveWhitespace} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition" > Remove Whitespace </button>
      </div>

      <div className="text-sm text-gray-600 text-center">
        Words: <strong>{wordCount}</strong> &nbsp; | &nbsp;
        Characters: <strong>{charCount}</strong>
      </div>
    </div>
  );
}

