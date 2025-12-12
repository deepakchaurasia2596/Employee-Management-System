/**
 * Application route constants
 */
export const AppRoutePaths = {
  EmployeesBase: '/employees',
  EmployeeAdd: '/employees/add',
  EmployeeEdit: '/employees/edit',
  Login: '/login',
  Unauthorized: '/unauthorized',
  Error: '/error'
} as const;

export const appConstants = {
  routes: AppRoutePaths,

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50] as const
  }
} as const;
