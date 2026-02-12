import { File, Upload, X } from "lucide-react";
import { memo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomFileInputProps
	extends BaseFormFieldProps,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	/**
	 * @property maxSize - The maximum allowed file size in megabytes (MB).
	 */
	maxSize?: number;
	/**
	 * @property allowedTypes - An array of allowed file types (e.g., ['image/jpeg', 'image/png']).
	 */
	allowedTypes?: string[];
	/**
	 * @property showPreview - If true, displays a preview of the selected files. Defaults to true.
	 */
	showPreview?: boolean;
}

const CustomFileInput = ({
	showPreview = true,
	onChange,
	maxSize,
	allowedTypes,
	...props
}: CustomFileInputProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [dragOver, setDragOver] = useState(false);

	// biome-ignore lint/correctness/noUnusedVariables: we are extracting vars use in the input component
	const { error, className, showHint, maxLength, ...inputProps } = props;

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setSelectedFiles(files);
		onChange?.(event);
	};

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault();
		setDragOver(false);

		const files = Array.from(event.dataTransfer.files);
		if (fileInputRef.current) {
			const dataTransfer = new DataTransfer();
			files.forEach((file) => {
				dataTransfer.items.add(file);
			});
			fileInputRef.current.files = dataTransfer.files;
			fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
		}
		setSelectedFiles(files);
	};

	const removeFile = (index: number) => {
		const newFiles = selectedFiles.filter((_, i) => i !== index);
		setSelectedFiles(newFiles);

		if (fileInputRef.current) {
			const dataTransfer = new DataTransfer();
			newFiles.forEach((file) => {
				dataTransfer.items.add(file);
			});
			fileInputRef.current.files = dataTransfer.files;
		}
	};
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<FormFieldWrapper {...props} error={error}>
			{(id, describedBy) => (
				<>
					<div
						className={cn(
							"relative rounded-2xl border border-border/60 border-dashed bg-muted/20 p-5 transition-colors",
							dragOver && "border-primary bg-primary/5",
							error && "border-destructive",
							className,
						)}
						onDrop={handleDrop}
						onDragOver={(e) => {
							e.preventDefault();
							setDragOver(true);
						}}
						onDragLeave={() => setDragOver(false)}
					>
						<input
							ref={fileInputRef}
							id={id}
							type="file"
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							aria-invalid={!!error}
							aria-describedby={describedBy}
							onChange={handleFileChange}
							{...inputProps} // safe props only
						/>
						<div className="text-center">
							<Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								<span className="font-medium text-primary">Click to upload</span> or
								drag and drop
							</p>
							{allowedTypes && (
								<p className="mt-1 text-muted-foreground text-xs">
									{allowedTypes.join(", ")}
								</p>
							)}
							{maxSize && (
								<p className="text-muted-foreground text-xs">
									Max size: {maxSize}MB
								</p>
							)}
						</div>
					</div>

					{showPreview && selectedFiles.length > 0 && (
						<div className="space-y-2">
							{selectedFiles.map((file, index) => (
								<div
									key={index}
									className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-3"
								>
									<div className="flex items-center space-x-2">
										<File className="h-4 w-4 text-muted-foreground" />
										<div>
											<p className="font-medium text-sm">{file.name}</p>
											<p className="text-muted-foreground text-xs">
												{formatFileSize(file.size)}
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => removeFile(index)}
										className="text-muted-foreground hover:text-destructive"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomFileInput);
