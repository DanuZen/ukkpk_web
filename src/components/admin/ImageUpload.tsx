import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  id: string;
  label: string;
  currentImageUrl?: string;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  id,
  label,
  currentImageUrl,
  onFileSelect,
  onRemove,
  disabled = false,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      {/* Drag & Drop Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          currentImageUrl && "border-solid"
        )}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {currentImageUrl ? (
          <div className="relative">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="mt-3 text-center">
              <p className="text-sm text-muted-foreground">
                Klik atau drag & drop untuk mengganti gambar
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {isDragging ? "Lepaskan untuk upload" : "Upload Gambar"}
            </p>
            <p className="text-xs text-muted-foreground">
              Klik atau drag & drop gambar di sini
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, atau WEBP (Max. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
