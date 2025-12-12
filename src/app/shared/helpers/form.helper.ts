// Angular imports
import { AbstractControl } from '@angular/forms';

export class FormHelper {
  static getError(control: AbstractControl | null, label: string = 'Field'): string | null {
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const err = control.errors;
    if (err['required']) return `${label} is required`;
    if (err['email']) return 'Invalid email format';
    if (err['minlength']) return `${label} must be at least ${err['minlength'].requiredLength} characters`;
    if (err['maxlength']) return `${label} cannot exceed ${err['maxlength'].requiredLength} characters`;
    if (err['min']) return `${label} must be at least ${err['min'].min}`;
    if (err['max']) return `${label} must be at most ${err['max'].max}`;
    if (err['phoneNumber']) return 'Invalid phone number';
    if (err['dateNotFuture']) return `${label} cannot be in the future`;
    if (err['emailDomain']) return `Email must be from ${err['emailDomain'].requiredDomain}`;
    if (err['salaryRange']) return `Salary must be between ₹${err['salaryRange'].min} and ₹${err['salaryRange'].max}`;
    if (err['pattern']) return `${label} has invalid format`;

    return 'Invalid input';
  }

  static hasError(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
