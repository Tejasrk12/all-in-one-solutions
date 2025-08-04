import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function CompressImage() {
  const [images, setImages] = useState([]);
  const [quality] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);

  const handleFiles = (files) => {
    const allowed = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    const newImages = allowed.map((file) => ({
      file,
      name: file.name,
      originalSize: file.size,
      compressedSize: null,
      compressedUrl: null,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img, i) => compressImage(img.file, images.length + i));
  };

  const compressImage = (file, index) => {
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
            if (blob.size < file.size) {
              const compressedUrl = URL.createObjectURL(blob);
              updateImage(index, {
                compressedSize: blob.size,
                compressedUrl,
                progress: 100,
              });
            } else {
              updateImage(index, {
                compressedSize: file.size,
                compressedUrl: URL.createObjectURL(file),
                progress: 100,
              });
            }
          },
          file.type,
          quality
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

  const formatSize = (bytes) => (bytes / 1024).toFixed(1) + " KB";

  const compressionPercent = (original, compressed) => {
    if (!original || !compressed) return "-";
    const percent = ((1 - compressed / original) * 100).toFixed(1);
    return compressed < original
      ? `${percent}% saved`
      : `${Math.abs(percent)}% larger`;
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("compressed-images");

    for (let img of images) {
      if (img.compressedUrl) {
        const blob = await fetch(img.compressedUrl).then((r) => r.blob());
        folder.file(img.name, blob);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "compressed-images.zip");
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

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">
        Image Compressor
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
          accept="image/jpeg, image/png, image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <p className="text-lg font-semibold mb-1">Click or Drag & Drop Files Here</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 space-y-4">
          <h3 className="text-md font-semibold">Total Images: {images.length}</h3>

          <div className="bg-white rounded shadow">
            <div className="grid grid-cols-7 text-sm font-semibold px-4 py-2 border-b">
              <div>#</div>
              <div className="col-span-2">File Name</div>
              <div>Original</div>
              <div>Compressed</div>
              <div>Saved</div>
              <div>Action</div>
            </div>

            {images.map((img, index) => (
              <div
                key={index}
                className="grid grid-cols-7 items-center text-sm px-4 py-2 border-t"
              >
                <div>{index + 1}</div>
                <div className="col-span-2 truncate">{img.name}</div>
                <div>{formatSize(img.originalSize)}</div>
                <div>
                  {img.compressedSize
                    ? formatSize(img.compressedSize)
                    : "Processing..."}
                </div>
                <div>
                  {img.compressedSize
                    ? compressionPercent(img.originalSize, img.compressedSize)
                    : "-"}
                </div>
                <div>
                  {img.compressedUrl ? (
                    <a
                      href={img.compressedUrl}
                      download={`compressed-${img.name}`}
                      className="text-blue-600 underline text-xs"
                    >
                      Download
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
          </div>

          <div className="text-center mt-6">
            <button
              onClick={downloadAll}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ⬇️ Download All as ZIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
