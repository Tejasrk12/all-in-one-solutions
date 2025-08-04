import React, { useState } from "react";
import { diffLines } from "diff";

export default function CompareCode() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState([]);
  const [mergedLines, setMergedLines] = useState([]);

  const handleCompare = () => {
    const cleanLeft = left.trim();
    const cleanRight = right.trim();
    const result = diffLines(cleanLeft, cleanRight);

    const merged = [];
    result.forEach((part) => {
      const lines = part.value.split("\n").filter((l) => l !== "");
      lines.forEach((line) => {
        merged.push({
          value: line,
          added: part.added || false,
          removed: part.removed || false,
          accepted: !part.added && !part.removed, // unchanged lines are accepted
        });
      });
    });

    setDiff(result);
    setMergedLines(merged);
  };

  const toggleAccept = (index) => {
    setMergedLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, accepted: !line.accepted } : line
      )
    );
  };

  let leftLine = 1;
  let rightLine = 1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Code Compare + Full Merge
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-semibold">Original Code</label>
          <textarea
            className="w-full h-60 p-3 mt-1 border rounded font-mono text-sm"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original code..."
          />
        </div>
        <div>
          <label className="font-semibold">Modified Code</label>
          <textarea
            className="w-full h-60 p-3 mt-1 border rounded font-mono text-sm"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified code..."
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

      {/* Line-by-line diff UI */}
      <div className="border rounded bg-white max-h-[600px] overflow-auto">
        <div className="min-w-[900px]">
          {mergedLines.map((line, i) => {
            const isAdded = line.added;
            const isRemoved = line.removed;
            const isUnchanged = !isAdded && !isRemoved;
            const showLeft = !isAdded;
            const showRight = !isRemoved;

            const lineNumLeft = showLeft ? leftLine++ : "";
            const lineNumRight = showRight ? rightLine++ : "";

            return (
              <div
                key={i}
                className="grid grid-cols-2 border-t text-sm font-mono"
              >
                {/* Original Side */}
                <div
                  className={`flex items-center border-r px-2 ${
                    isRemoved
                      ? line.accepted
                        ? "bg-red-200"
                        : "bg-red-100 line-through"
                      : ""
                  }`}
                >
                  <div className="w-10 text-right pr-2 text-gray-400 shrink-0">
                    {lineNumLeft}
                  </div>
                  <div className="px-1 py-1 whitespace-pre-wrap flex-1">
                    {showLeft ? line.value : ""}
                  </div>
                  {isRemoved && (
                    <button
                      onClick={() => toggleAccept(i)}
                      className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded hover:bg-blue-300"
                    >
                      {line.accepted ? "Reject" : "Accept"}
                    </button>
                  )}
                </div>

                {/* Modified Side */}
                <div
                  className={`flex items-center px-2 relative ${
                    isAdded
                      ? line.accepted
                        ? "bg-green-200"
                        : "bg-green-100 underline"
                      : ""
                  }`}
                >
                  <div className="w-10 text-right pr-2 text-gray-400 shrink-0">
                    {lineNumRight}
                  </div>
                  <div className="px-1 py-1 whitespace-pre-wrap flex-1">
                    {showRight ? line.value : ""}
                  </div>
                  {isAdded && (
                    <button
                      onClick={() => toggleAccept(i)}
                      className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded hover:bg-blue-300"
                    >
                      {line.accepted ? "Reject" : "Accept"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Merged Code */}
      {mergedLines.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Merged Code Output</h3>
          <textarea
            className="w-full h-[300px] p-3 border border-gray-300 rounded-md text-sm font-mono bg-white overflow-auto"
            value={mergedLines
              .filter((line) => line.accepted)
              .map((line) => line.value)
              .join("\n")}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
