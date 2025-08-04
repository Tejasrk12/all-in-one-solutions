import React, { useState, useEffect } from "react";

export default function HeicToJpg() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [format, setFormat] = useState("jpg"); // jpg or png

  useEffect(() => {
    if (!window.heic2any || !window.JSZip) {
      console.warn("CDN libraries not loaded.");
    }
  }, []);

  const handleFiles = (files) => {
    const heicFiles = Array.from(files).filter((file) =>
      file.name.toLowerCase().endsWith(".heic")
    );

    const newImages = heicFiles.map((file) => ({
      file,
      name: file.name,
      outputBlob: null,
      outputUrl: null,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img, i) =>
      convertToFormat(img.file, images.length + i)
    );
  };

  const convertToFormat = async (file, index) => {
    try {
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const extension = format;

      const result = await window.heic2any({
        blob: file,
        toType: mimeType,
        quality: 0.9,
      });

      const outputBlob = result instanceof Blob ? result : result[0];
      const outputUrl = URL.createObjectURL(outputBlob);

      updateImage(index, { outputBlob, outputUrl, progress: 100 });
    } catch (err) {
      console.error("Conversion error:", err);
      updateImage(index, { progress: 100 });
    }
  };

  const updateImage = (index, data) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDownloadAll = async () => {
    if (!window.JSZip) {
      alert("JSZip is not loaded.");
      return;
    }

    const zip = new window.JSZip();

    images.forEach((img) => {
      if (img.outputBlob) {
        const fileName = img.name.replace(/\.heic$/i, `.${format}`);
        zip.file(fileName, img.outputBlob);
      }
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = `converted-images.${format}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">HEIC to {format.toUpperCase()} Converter</h2>

      <div className="flex justify-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="format"
            value="jpg"
            checked={format === "jpg"}
            onChange={(e) => setFormat(e.target.value)}
            className="mr-1"
          />
          JPG
        </label>
        <label>
          <input
            type="radio"
            name="format"
            value="png"
            checked={format === "png"}
            onChange={(e) => setFormat(e.target.value)}
            className="mr-1"
          />
          PNG
        </label>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={`max-w-3xl mx-auto border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input
          type="file"
          multiple
          accept=".heic"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="uploadInput"
        />
        <label htmlFor="uploadInput" className="cursor-pointer">
          <p className="text-lg font-semibold mb-1">Click or Drag & Drop HEIC Files</p>
          <p className="text-sm text-gray-500">
            They will be converted to {format.toUpperCase()} using CDN
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8 space-y-4">
          <div className="bg-white rounded shadow">
            <div className="grid grid-cols-4 text-sm font-semibold px-4 py-2 border-b">
              <div>#</div>
              <div>File Name</div>
              <div>Status</div>
              <div>Download</div>
            </div>

            {images.map((img, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center text-sm px-4 py-2 border-t"
              >
                <div>{index + 1}</div>
                <div className="truncate">{img.name}</div>
                <div>
                  {img.progress < 100 ? (
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${img.progress}%` }}
                      />
                    </div>
                  ) : (
                    "Converted"
                  )}
                </div>
                <div>
                  {img.outputUrl && (
                    <a
                      href={img.outputUrl}
                      download={img.name.replace(/\.heic$/i, `.${format}`)}
                      className="text-blue-600 underline text-xs"
                    >
                      Download {format.toUpperCase()}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {images.every((img) => img.outputBlob) && (
            <div className="text-center mt-6">
              <button
                onClick={handleDownloadAll}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download All as ZIP
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
