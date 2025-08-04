import React, { useState } from "react";
import { diffWords } from "diff";

export default function CompareText() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffResult, setDiffResult] = useState([]);
  const [mergedText, setMergedText] = useState("");

  const cleanText = (text) =>
    text
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " ")) // Clean each line
      .join("\n")
      .trim(); // Final cleanup

  const handleCompare = () => {
    const cleanOriginal = cleanText(original);
    const cleanModified = cleanText(modified);

    const diff = diffWords(cleanOriginal, cleanModified);
    const withId = diff.map((part, idx) => ({
      ...part,
      id: idx,
      selected: !part.added && !part.removed,
    }));
    setDiffResult(withId);
    setMergedText(withId.filter((p) => p.selected).map((p) => p.value).join(""));
  };

  const toggleSelection = (id) => {
    const updated = diffResult.map((part) =>
      part.id === id ? { ...part, selected: !part.selected } : part
    );
    setDiffResult(updated);
    setMergedText(updated.filter((p) => p.selected).map((p) => p.value).join(""));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">
        Text Comparison + Merge
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-semibold block mb-1">Original Text</label>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm resize-none"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Changed Text</label>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm resize-none"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleCompare}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Compare
        </button>
      </div>

      {diffResult.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono mb-6">
            <div>
              <h3 className="font-semibold text-center mb-1">
                Original + Removed
              </h3>
              <div className="bg-white p-4 rounded shadow whitespace-pre-wrap break-words">
                {diffResult.map((part) =>
                  !part.added ? (
                    <span
                      key={part.id}
                      onClick={() => toggleSelection(part.id)}
                      className={`cursor-pointer ${
                        part.removed
                          ? part.selected
                            ? "bg-red-200 text-red-900"
                            : "bg-red-100 text-red-600 line-through"
                          : ""
                      }`}
                    >
                      {part.value}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-center mb-1">
                Modified + Added
              </h3>
              <div className="bg-white p-4 rounded shadow whitespace-pre-wrap break-words">
                {diffResult.map((part) =>
                  !part.removed ? (
                    <span
                      key={part.id}
                      onClick={() => toggleSelection(part.id)}
                      className={`cursor-pointer ${
                        part.added
                          ? part.selected
                            ? "bg-green-200 text-green-900"
                            : "bg-green-100 text-green-600 underline"
                          : ""
                      }`}
                    >
                      {part.value}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-center font-semibold mb-2">Merged Output</h3>
            <div className="bg-white p-4 rounded shadow text-sm font-mono min-h-[100px]">
              {mergedText
                .split("\n")
                .filter((_, idx, arr) => idx !== arr.length - 1 || arr[idx].trim() !== "")
                .map((line, index) => (
                  <div key={index} className="flex">
                    <span className="w-10 text-right pr-2 text-gray-500">
                      {index + 1}
                    </span>
                    <span className="whitespace-pre-wrap break-words flex-1">
                      {line}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
