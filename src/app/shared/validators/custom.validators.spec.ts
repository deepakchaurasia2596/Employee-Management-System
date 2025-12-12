// Angular imports
import { FormControl } from '@angular/forms';

// Internal imports
import { CustomValidators } from './custom.validators';

describe('CustomValidators', () => {
  // Email domain validator
  describe('emailDomain()', () => {
    it('should return null when email domain is valid', () => {
      // Arrange
      const validator = CustomValidators.emailDomain('example.com');
      const control = new FormControl('test@example.com');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error object when email domain is invalid', () => {
      // Arrange
      const validator = CustomValidators.emailDomain('example.com');
      const control = new FormControl('test@other.com');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ emailDomain: { value: 'test@other.com' } });
    });

    it('should return null when value is empty', () => {
      // Arrange
      const validator = CustomValidators.emailDomain('example.com');
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  // Phone number validator
  describe('phoneNumber()', () => {
    it('should return null for a valid phone number with dashes', () => {
      // Arrange
      const validator = CustomValidators.phoneNumber();
      const control = new FormControl('+1-234-567-8900');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for a valid phone number with spaces', () => {
      // Arrange
      const validator = CustomValidators.phoneNumber();
      const control = new FormControl('+1 234 567 8900');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error when phone number is invalid', () => {
      // Arrange
      const validator = CustomValidators.phoneNumber();
      const control = new FormControl('abc123');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ phoneNumber: { value: 'abc123' } });
    });

    it('should return null for empty phone value', () => {
      // Arrange
      const validator = CustomValidators.phoneNumber();
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  // ---------------------------
  // Salary range validator
  // ---------------------------
  describe('salaryRange()', () => {
    const minSalary = 30000;
    const maxSalary = 200000;

    it('should return null when salary is within the allowed range', () => {
      // Arrange
      const validator = CustomValidators.salaryRange(minSalary, maxSalary);
      const control = new FormControl(70000); // numeric value

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error when salary is below minimum', () => {
      // Arrange
      const validator = CustomValidators.salaryRange(minSalary, maxSalary);
      const control = new FormControl(20000); // numeric value below min

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual(
        jasmine.objectContaining({
          salaryRange: jasmine.objectContaining({
            value: control.value,
            min: minSalary,
            max: maxSalary
          })
        })
      );
    });

    it('should return error when salary is above maximum', () => {
      // Arrange
      const validator = CustomValidators.salaryRange(minSalary, maxSalary);
      const control = new FormControl(250000); // numeric value above max

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual(
        jasmine.objectContaining({
          salaryRange: jasmine.objectContaining({
            value: control.value,
            min: minSalary,
            max: maxSalary
          })
        })
      );
    });

    it('should return null for empty salary value', () => {
      // Arrange
      const validator = CustomValidators.salaryRange(minSalary, maxSalary);
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  // Date not future validator
  describe('dateNotFuture()', () => {
    it('should return null for a past date', () => {
      // Arrange
      const validator = CustomValidators.dateNotFuture();
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const control = new FormControl(pastDate.toISOString().split('T')[0]);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for today date', () => {
      // Arrange
      const validator = CustomValidators.dateNotFuture();
      const today = new Date().toISOString().split('T')[0];
      const control = new FormControl(today);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error for a future date', () => {
      // Arrange
      const validator = CustomValidators.dateNotFuture();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const control = new FormControl(futureDate.toISOString().split('T')[0]);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ dateNotFuture: { value: control.value } });
    });

    it('should return null for empty date value', () => {
      // Arrange
      const validator = CustomValidators.dateNotFuture();
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  // Image file validator
  describe('imageFile()', () => {
    it('should return null for a valid image file (jpeg)', () => {
      // Arrange
      const validator = CustomValidators.imageFile();
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const control = new FormControl(file);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error for invalid file type', () => {
      // Arrange
      const validator = CustomValidators.imageFile();
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const control = new FormControl(file);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ imageFile: { value: 'Invalid file type' } });
    });

    it('should return error when file size exceeds limit', () => {
      // Arrange
      const validator = CustomValidators.imageFile();
      // create a large blob (~6MB)
      const bigBlob = new Blob([new Array(6 * 1024 * 1024).fill('a').join('')], {
        type: 'image/jpeg'
      });
      const largeFile = new File([bigBlob], 'large.jpg', { type: 'image/jpeg' });
      const control = new FormControl(largeFile);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ imageFile: { value: 'File size exceeds 5MB' } });
    });

    it('should return null when control value is not a File instance', () => {
      // Arrange
      const validator = CustomValidators.imageFile();
      const control = new FormControl('not-a-file');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for empty control value', () => {
      // Arrange
      const validator = CustomValidators.imageFile();
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });
});
