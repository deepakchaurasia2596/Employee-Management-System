// Angular imports
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements ControlValueAccessor {
  @Input() previewUrl: string | null = null;
  @Output() imageSelected = new EventEmitter<File | null>();

  selectedFile: File | null = null;
  preview: string | null = null;
  onChange: (value: File | null) => void = () => {};
  onTouched: () => void = () => {};

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.imageSelected.emit(file);
      this.onChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.preview = null;
    this.onChange(null);
    this.imageSelected.emit(null);
  }

  writeValue(value: File | null): void {
    this.selectedFile = value;
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

