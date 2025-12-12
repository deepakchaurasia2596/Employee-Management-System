// Angular imports
import { Pipe, PipeTransform } from '@angular/core';

// Internal imports
import { Employee } from '../../core/models/employee.model';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {
  transform(employee: Employee | null | undefined): string {
    if (!employee) return '';

    const first = (employee.firstName || '').trim().replace(/\s+/g, ' ');
    const last = (employee.lastName || '').trim().replace(/\s+/g, ' ');

    return [first, last].filter(x => x).join(' ');
  }
}
