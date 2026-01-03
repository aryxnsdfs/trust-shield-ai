import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
  accept?: string;
  label?: string;
  description?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  file,
  onClear,
  accept = 'image/*,application/pdf',
  label = 'Drop file to upload',
  description = 'PDF, Images, Documents',
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const getFileIcon = () => {
    if (!file) return Upload;
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  const FileIcon = getFileIcon();

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-muted/30',
        file && 'border-solid border-success/50 bg-success/5'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
              className="relative z-20 p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 flex flex-col items-center justify-center text-center"
          >
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors',
                isDragging ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              <Upload
                className={cn(
                  'w-7 h-7 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </div>
            <p className="font-medium text-foreground mb-1">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileDropzone;
