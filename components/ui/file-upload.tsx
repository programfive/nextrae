"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Types
export type FileUploadValue = File[];

type FileUploadContextValue = {
  files: FileUploadValue;
  setFiles: (files: FileUploadValue) => void;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  onFileReject?: (file: File, message: string) => void;
  openFileDialog: () => void;
  removeFile: (file: File) => void;
};

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null,
);

const FileUploadItemContext = React.createContext<File | null>(null);

function useFileUploadItemContext() {
  const ctx = React.useContext(FileUploadItemContext);
  if (!ctx) {
    throw new Error(
      "FileUploadItem subcomponents must be used inside <FileUploadItem>",
    );
  }
  return ctx;
}

function useFileUploadContext() {
  const ctx = React.useContext(FileUploadContext);
  if (!ctx) {
    throw new Error("FileUpload subcomponents must be used inside <FileUpload>");
  }
  return ctx;
}

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: FileUploadValue;
  onValueChange: (files: FileUploadValue) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  multiple?: boolean;
  onFileReject?: (file: File, message: string) => void;
}

export function FileUpload({
  value,
  onValueChange,
  maxFiles,
  maxSize,
  multiple,
  onFileReject,
  className,
  children,
  ...props
}: FileUploadProps) {
  const [files, setFilesState] = React.useState<FileUploadValue>(value ?? []);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setFilesState(value ?? []);
  }, [value]);

  const applyFiles = React.useCallback(
    (next: FileUploadValue) => {
      setFilesState(next);
      onValueChange(next);
    },
    [onValueChange],
  );

  const handleFiles = React.useCallback(
    (incoming: FileList | File[] | null) => {
      if (!incoming || incoming.length === 0) return;

      const current = [...files];
      const list = Array.from(incoming);

      for (const file of list) {
        if (maxFiles && current.length >= maxFiles) {
          onFileReject?.(
            file,
            `Solo se permiten hasta ${maxFiles} archivo(s)`,
          );
          continue;
        }

        if (maxSize && file.size > maxSize) {
          onFileReject?.(
            file,
            `El archivo supera el tamaño máximo permitido`,
          );
          continue;
        }

        // avoid duplicates by name+size
        const exists = current.some(
          (f) => f.name === file.name && f.size === file.size,
        );
        if (exists) continue;

        current.push(file);
      }

      applyFiles(current);
    },
    [files, maxFiles, maxSize, onFileReject, applyFiles],
  );

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = React.useCallback(
    (file: File) => {
      const filtered = files.filter(
        (f) => !(f.name === file.name && f.size === file.size),
      );
      applyFiles(filtered);
    },
    [files, applyFiles],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // reset so selecting the same file again still triggers change
    event.target.value = "";
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        setFiles: applyFiles,
        maxFiles,
        maxSize,
        multiple,
        onFileReject,
        openFileDialog,
        removeFile,
      }}
    >
      <div className={cn("space-y-3", className)} {...props}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={handleInputChange}
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

export type FileUploadDropzoneProps = React.HTMLAttributes<HTMLDivElement>;

export function FileUploadDropzone({
  className,
  onDragOver,
  onDrop,
  onDragLeave,
  ...props
}: FileUploadDropzoneProps) {
  const { openFileDialog } = useFileUploadContext();
  const { files, maxFiles, onFileReject, maxSize, setFiles } =
    useFileUploadContext();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDragOver?.(event);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dt = event.dataTransfer;
    const list = dt.files;

    if (!list || list.length === 0) return;

    const next: File[] = [...files];
    for (const file of Array.from(list)) {
      if (maxFiles && next.length >= maxFiles) {
        onFileReject?.(file, `Solo se permiten hasta ${maxFiles} archivo(s)`);
        continue;
      }
      if (maxSize && file.size > maxSize) {
        onFileReject?.(
          file,
          `El archivo supera el tamaño máximo permitido`,
        );
        continue;
      }
      const exists = next.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (!exists) next.push(file);
    }
    setFiles(next);

    onDrop?.(event);
  };

  const handleClick = () => {
    openFileDialog();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-4 text-sm",
        "hover:border-muted-foreground/70 transition-colors cursor-pointer",
        className,
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
    >
      {props.children}
    </div>
  );
}

export type FileUploadListProps = React.HTMLAttributes<HTMLDivElement>;

export function FileUploadList({ className, children, ...props }: FileUploadListProps) {
  const { files } = useFileUploadContext();

  if (!files.length) return null;

  return (
    <div
      className={cn("space-y-2 rounded-md border bg-card p-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface FileUploadItemProps {
  value: File;
  children?: React.ReactNode;
}

export function FileUploadItem({ value, children }: FileUploadItemProps) {
  return (
    <FileUploadItemContext.Provider value={value}>
      <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-sm">
        {children}
      </div>
    </FileUploadItemContext.Provider>
  );
}

export interface FileUploadItemPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function FileUploadItemPreview({ className, children, ...props }: FileUploadItemPreviewProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <span className="text-xs font-semibold">FILE</span>}
    </div>
  );
}

export type FileUploadItemMetadataProps = React.HTMLAttributes<HTMLDivElement>;

export function FileUploadItemMetadata({ className, ...props }: FileUploadItemMetadataProps) {
  const file = useFileUploadItemContext();

  const sizeInKB = file.size / 1024;
  const displaySize =
    sizeInKB > 1024
      ? `${(sizeInKB / 1024).toFixed(1)} MB`
      : `${sizeInKB.toFixed(1)} KB`;

  return (
    <div className={cn("flex-1 text-xs", className)} {...props}>
      <p className="font-medium truncate">{file.name}</p>
      <p className="text-muted-foreground">{displaySize}</p>
    </div>
  );
}

export interface FileUploadItemDeleteProps {
  asChild?: boolean;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function FileUploadItemDelete({ asChild, children }: FileUploadItemDeleteProps) {
  const { removeFile } = useFileUploadContext();
  const file = useFileUploadItemContext();

  if (!children) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    removeFile(file);
  };

  const element = React.cloneElement(children, {
    onClick: handleClick,
  });

  return asChild ? element : element;
}

export interface FileUploadTriggerProps {
  asChild?: boolean;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function FileUploadTrigger({ asChild, children }: FileUploadTriggerProps) {
  const { openFileDialog } = useFileUploadContext();

  if (!children) return null;

  const props = {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      openFileDialog();
    },
  };

  return asChild ? React.cloneElement(children, props) : children;
}
