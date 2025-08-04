// src/App.js
import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function MovToMp4() {
  const [ffmpeg] = useState(() =>
  createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/ffmpeg-core.js",
  })
);
  const [video, setVideo] = useState(null);
  const [output, setOutput] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.setProgress(({ ratio }) => {
        setProgress(Math.round(ratio * 100));
      });
      await ffmpeg.load();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideo(file);
    setOutput(null);
    setProgress(0);
    setLoading(true);

    await convertToMp4(file);

    setLoading(false);
  };

  const convertToMp4 = async (file) => {
    await loadFFmpeg();
    ffmpeg.FS("writeFile", "input.mov", await fetchFile(file));
    await ffmpeg.run("-i", "input.mov", "output.mp4");
    const data = ffmpeg.FS("readFile", "output.mp4");

    const mp4Blob = new Blob([data.buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(mp4Blob);
    setOutput(url);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6">MOV to MP4 Converter</h1>

      <input
        type="file"
        accept=".mov,video/quicktime"
        onChange={handleFileChange}
        className="mb-4"
      />

      {loading && <p className="text-blue-600 mb-2">Converting... {progress}%</p>}

      {output && (
        <div className="mt-4">
          <video controls src={output} className="max-w-full mb-2" />
          <br />
          <a
            href={output}
            download="converted.mp4"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download MP4
          </a>
        </div>
      )}
    </div>
  );
}

