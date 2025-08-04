import React, { useState } from "react";
import { js as beautifyJs } from "js-beautify";

export default function JsFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    const formatted = beautifyJs(input, {
      indent_size: 2,
      space_in_empty_paren: true,
      preserve_newlines: true,
    }).replace(/^\s*[\r\n]/gm, ""); // remove blank lines
    setOutput(formatted);
  };

  const handleMinify = () => {
    const minified = input
      .replace(/\/\/.*$/gm, "")             // remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "")     // remove block comments
      .replace(/\s{2,}/g, " ")              // multiple spaces to single
      .replace(/\s*([{};,:])\s*/g, "$1")    // trim around symbols
      .replace(/;\s*}/g, "}")               // remove semicolon before }
      .replace(/^\s*[\r\n]/gm, "")          // remove blank lines
      .trim();
    setOutput(minified);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          JS Formatter & Minifier – Beautify & Organise Code
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Input JavaScript</label>
            <textarea
              className="w-full h-[350px] p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JS code here..."
            />
          </div>

          {/* Output */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Output JavaScript</label>
            <textarea
              className="w-full h-[350px] p-3 border border-gray-300 rounded-md resize-none text-sm bg-gray-100"
              value={output}
              readOnly
              placeholder="Formatted or minified output will appear here..."
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleBeautify}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Beautify
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Minify
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
