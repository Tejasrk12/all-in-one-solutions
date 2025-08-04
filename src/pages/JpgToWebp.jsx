import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function JpgToWebp() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);

  const handleFiles = (files) => {
    const validImages = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    const newImages = validImages.map((file) => ({
      file,
      name: file.name,
      originalSize: file.size,
      compressedSize: null,
      webpUrl: null,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img, i) => convertToWebp(img.file, images.length + i));
  };

  const convertToWebp = (file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            const webpUrl = URL.createObjectURL(blob);
            const compressedSize = blob.size;

            updateImage(index, {
              webpUrl,
              compressedSize,
              progress: 100,
            });
          },
          "image/webp",
          0.7
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const updateImage = (index, data) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  };

  const compressionPercent = (original, compressed) => {
    if (!original || !compressed) return "-";
    const percent = ((1 - compressed / original) * 100).toFixed(1);
    return compressed < original
      ? `${percent}% saved`
      : `${Math.abs(percent)}% larger`;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const webpImages = images.filter((img) => img.webpUrl);
    for (let img of webpImages) {
      const response = await fetch(img.webpUrl);
      const blob = await response.blob();
      const fileName = img.name.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      zip.file(fileName, blob);
    }

    zip.generateAsync({ type: "blob" }).then((zipFile) => {
      saveAs(zipFile, "converted-webp-images.zip");
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">
        JPG/PNG to Compressed WebP Converter
      </h2>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`max-w-4xl mx-auto border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="uploadInput"
        />
        <label htmlFor="uploadInput" className="cursor-pointer">
          <p className="text-lg font-semibold mb-1">Click or Drag & Drop JPG/PNG Files</p>
          <p className="text-sm text-gray-500">They will be converted to Compressed WebP format</p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 space-y-4">
          <div className="bg-white rounded shadow">
            <div className="grid grid-cols-6 text-sm font-semibold px-4 py-2 border-b">
              <div>#</div>
              <div className="col-span-2">File Name</div>
              <div>Sizes</div>
              <div>Saved</div>
              <div>Action</div>
            </div>

            {images.map((img, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center text-sm px-4 py-2 border-t"
              >
                <div>{index + 1}</div>
                <div className="col-span-2 truncate">{img.name}</div>
                <div>
                  {img.compressedSize
                    ? `${formatSize(img.originalSize)} → ${formatSize(img.compressedSize)}`
                    : formatSize(img.originalSize)}
                </div>
                <div>
                  {img.compressedSize
                    ? compressionPercent(img.originalSize, img.compressedSize)
                    : "-"}
                </div>
                <div>
                  {img.webpUrl ? (
                    <a
                      href={img.webpUrl}
                      download={img.name.replace(/\.(jpg|jpeg|png)$/i, ".webp")}
                      className="text-blue-600 underline text-xs"
                    >
                      Download WebP
                    </a>
                  ) : (
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${img.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {images.some((img) => img.webpUrl) && (
              <div className="py-4 border-t flex justify-center">
                <button
                  onClick={handleDownloadAll}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Download All WebP as ZIP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
