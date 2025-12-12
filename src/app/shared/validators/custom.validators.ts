// Angular imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static emailDomain(domain: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const email = control.value as string;
      const emailDomain = email.split('@')[1];
      return emailDomain === domain ? null : { emailDomain: { value: control.value } };
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      const isValid = phoneRegex.test(control.value);
      return isValid ? null : { phoneNumber: { value: control.value } };
    };
  }

  static salaryRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const salary = Number(control.value);
      if (isNaN(salary)) {
        return { salaryRange: { value: control.value } };
      }
      return salary >= min && salary <= max
        ? null
        : { salaryRange: { value: control.value, min, max } };
    };
  }

  static dateNotFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Convert input to "yyyy-mm-dd" without time
      const inputDate = new Date(value);
      const today = new Date();

      // Normalize both dates to 00:00:00 to avoid time comparison issues
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // If input date > today → invalid
      if (inputDate.getTime() > today.getTime()) {
        return { dateNotFuture: { value: control.value } };
      }

      return null;
    };
  }

  static imageFile(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const file = control.value as File;
      if (!(file instanceof File)) {
        return null;
      }
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        return { imageFile: { value: 'Invalid file type' } };
      }

      if (file.size > maxSize) {
        return { imageFile: { value: 'File size exceeds 5MB' } };
      }

      return null;
    };
  }
}

