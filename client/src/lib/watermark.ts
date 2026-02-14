export const addWatermark = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Watermark Configuration
        const text = "Vectyz";
        const fontSize = Math.max(24, Math.floor(img.width / 20)); // Responsive font size
        const font = `bold ${fontSize}px sans-serif`;
        const textColor = "rgba(255, 255, 255, 0.5)";
        
        // Create a separate canvas for the pattern tile
        const patternCanvas = document.createElement("canvas");
        const patternCtx = patternCanvas.getContext("2d");
        
        if (!patternCtx) {
            reject(new Error("Could not get pattern canvas context"));
            return;
        }

        // Tile size - adjust based on image size or fixed
        const tileSize = fontSize * 8; 
        patternCanvas.width = tileSize;
        patternCanvas.height = tileSize;

        // Draw diagonal lines (X shape)
        patternCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        patternCtx.lineWidth = 1;
        
        // Line from top-left to bottom-right
        patternCtx.beginPath();
        patternCtx.moveTo(0, 0);
        patternCtx.lineTo(tileSize, tileSize);
        patternCtx.stroke();
        
        // Line from top-right to bottom-left
        patternCtx.beginPath();
        patternCtx.moveTo(tileSize, 0);
        patternCtx.lineTo(0, tileSize);
        patternCtx.stroke();

        // Rotate for text
        patternCtx.translate(tileSize / 2, tileSize / 2);
        patternCtx.rotate((-45 * Math.PI) / 180);
        patternCtx.translate(-tileSize / 2, -tileSize / 2);

        // Draw Text
        patternCtx.font = font;
        patternCtx.fillStyle = textColor;
        patternCtx.textAlign = "center";
        patternCtx.textBaseline = "middle";
        patternCtx.fillText(text, tileSize / 2, tileSize / 2);

        // Optional: Draw lines or extra decoration if needed to match "Creative Market" style
        // For now, just the text is a good start.

        // Create the pattern
        const pattern = ctx.createPattern(patternCanvas, "repeat");
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Export as Blob/File
        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(watermarkedFile);
          } else {
            reject(new Error("Could not create blob from canvas"));
          }
        }, file.type);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
