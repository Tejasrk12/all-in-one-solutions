import React, { useState } from "react";
import { html as beautifyHtml } from "js-beautify";

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    const formatted = beautifyHtml(input, {
      indent_size: 2,
      wrap_line_length: 80,
      preserve_newlines: true,
    })
    .replace(/^\s*[\r\n]/gm, ""); // ✅ remove blank lines
    setOutput(formatted);
  };

  const handleMinify = () => {
    const minified = input
      .replace(/>\s+</g, "><")           // remove spaces between tags
      .replace(/\s{2,}/g, " ")           // reduce multiple spaces
      .replace(/<!--[\s\S]*?-->/g, "")   // remove HTML comments
      .replace(/^\s*[\r\n]/gm, "")       // ✅ remove blank lines
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
    <div className="max-w-6xl min-h-screen mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">HTML Formatter & Minifier</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Input HTML</label>
          <textarea
            className="w-full h-[250px] md:h-[350px] p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your messy HTML here..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Output HTML</label>
          <textarea
            className="w-full h-[250px] md:h-[350px] p-3 border border-gray-300 rounded-md resize-none text-sm bg-gray-50"
            value={output}
            readOnly
            placeholder="Formatted or minified output will appear here..."
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button onClick={handleBeautify} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Beautify
        </button>
        <button onClick={handleMinify} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Minify
        </button>
        <button onClick={handleCopy} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Clear
        </button>
      </div>
    </div>
  );
}
