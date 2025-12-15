// Angular imports
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Internal imports
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { FormHelper } from '../../shared/helpers/form.helper';
import { appConstants } from '../../core/constants/app.constants';

// Mock data import
import mockUserData from '../../shared/mockData/mock-users.json'

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let mockAuthService: { login: any; isAuthenticated: any };
  let mockToastService: jasmine.SpyObj<ToastrService>;
  let mockRouter: { navigate: any };
  let mockActivatedRoute: { snapshot: any };

  // Page Object with reusable mock data and DOM queries
  class Page {
    get mockUsers() {
      return mockUserData;
    }

    get usernameInput(): HTMLInputElement {
      return fixture.debugElement.query(By.css('#username'))?.nativeElement;
    }

    get passwordInput(): HTMLInputElement {
      return fixture.debugElement.query(By.css('#password'))?.nativeElement;
    }

    get submitButton(): HTMLButtonElement {
      return fixture.debugElement.query(By.css('.submit-btn'))?.nativeElement;
    }

    get formDebug() {
      return fixture.debugElement.query(By.css('form'));
    }

    fillForm(username: string, password: string) {
      component.loginForm.controls['username'].setValue(username);
      component.loginForm.controls['password'].setValue(password);
      fixture.detectChanges();
    }

    submitFormViaEvent() {
      const formEl = this.formDebug?.nativeElement as HTMLFormElement;
      formEl.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
    }
  }

  const page = new Page();

  beforeEach(waitForAsync(() => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of({})),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false)
    };

    mockToastService = jasmine.createSpyObj<ToastrService>(
      'ToastrService',
      ['success', 'error']
    );

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      snapshot: { queryParams: {} }
    };

    TestBed.configureTestingModule({
      imports: [LoginComponent], // standalone component must be in imports
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**************************************************************************
   * Component basics
   **************************************************************************/
  describe('Component creation & defaults', () => {
    it('should create component and set default returnUrl', () => {
      // Assert
      expect(component).toBeTruthy();
      expect(component.returnUrl).toBe(appConstants.routes.EmployeesBase);
    });
  });

  /**************************************************************************
   * UI tests
   **************************************************************************/
  describe('UI behavior', () => {
    it('should disable submit button when form is invalid', () => {
      // Arrange
      component.loginForm.controls['username'].setValue('');
      component.loginForm.controls['password'].setValue('');
      // Act
      const disabled = page.submitButton.disabled;
      fixture.detectChanges();

      // Assert
      expect(component.loginForm.invalid).toBeTrue();
      expect(disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      // Arrange
      page.fillForm(page.mockUsers[0].username, page.mockUsers[0].password);

      // Act
      const enabled = page.submitButton.disabled === false;

      // Assert
      expect(component.loginForm.valid).toBeTrue();
      expect(enabled).toBeTrue();
    });

    it('should update form values when typing', () => {
      // Arrange
      const usernameEl = page.usernameInput;
      const passwordEl = page.passwordInput;

      // Act
      usernameEl.value = 'manager';
      usernameEl.dispatchEvent(new Event('input'));
      passwordEl.value = 'manager123';
      passwordEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Assert
      expect(component.loginForm.value.username).toBe('manager');
      expect(component.loginForm.value.password).toBe('manager123');
    });

    it('should render demo credentials in template', () => {
      // Arrange: template already rendered in beforeEach
      // Act
      const demo = fixture.nativeElement.querySelector('.demo-credentials');

      // Assert
      expect(demo).toBeTruthy();
      expect(demo.textContent).toContain('Admin: admin / admin123');
      expect(demo.textContent).toContain('Manager: manager / manager123');
      expect(demo.textContent).toContain('User: user / user123');
    });
  });

  /**************************************************************************
   * White-box tests
   **************************************************************************/
  describe('Internal methods', () => {
    it('markFormGroupTouched should mark all controls as touched', () => {
      // Arrange
      const usernameCtrl = component.loginForm.get('username')!;
      const passwordCtrl = component.loginForm.get('password')!;

      const spyU = spyOn(usernameCtrl, 'markAsTouched').and.callThrough();
      const spyP = spyOn(passwordCtrl, 'markAsTouched').and.callThrough();

      // Act
      component.markFormGroupTouched();

      // Assert
      expect(spyU).toHaveBeenCalled();
      expect(spyP).toHaveBeenCalled();
    });

    it('getError delegates to FormHelper.getError', () => {
      // Arrange
      const ghSpy = spyOn(FormHelper, 'getError').and.returnValue('Error');
      // Act
      const res = component.getError('username', 'Username');

      // Assert
      expect(ghSpy).toHaveBeenCalledWith(component.loginForm.get('username'), 'Username');
      expect(res).toBe('Error');
    });

    it('hasError delegates to FormHelper.hasError', () => {
      // Arrange
      const ghSpy = spyOn(FormHelper, 'hasError').and.returnValue(true);

      // Act
      const res = component.hasError('password');

      // Assert
      expect(ghSpy).toHaveBeenCalledWith(component.loginForm.get('password'));
      expect(res).toBeTrue();
    });
  });

  /**************************************************************************
   * Auth & Toastr tests
   **************************************************************************/
  describe('Authentication flow', () => {
    it('should login successfully and navigate', fakeAsync(() => {
      // Arrange
      page.fillForm(page.mockUsers[0].username, page.mockUsers[0].password);
      mockAuthService.login.and.returnValue(of({ token: 'abc' }));
      fixture.detectChanges();

      // Act
      // Use submit event so onSubmit() runs in same way the form would on valid submit
      page.submitFormViaEvent();
      tick();

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: page.mockUsers[0].username,
        password: page.mockUsers[0].password
      });
      expect(mockToastService.success).toHaveBeenCalledWith('Login successful');
      expect(mockRouter.navigate).toHaveBeenCalledWith([component.returnUrl]);
    }));

    it('should show error toast on login failure', fakeAsync(() => {
      // Arrange
      page.fillForm('baduser', 'badpass');
      mockAuthService.login.and.returnValue(throwError(() => ({})));
      fixture.detectChanges();

      // Act
      page.submitFormViaEvent();
      tick();

      // Assert
      expect(mockAuthService.login).toHaveBeenCalled();
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Invalid username or password'
      );
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should not login when form invalid', fakeAsync(() => {
      // Arrange
      page.fillForm('baduser', 'badpass');
      mockAuthService.login.and.returnValue(throwError(() => ({})));
      fixture.detectChanges();

      // Act
      page.submitFormViaEvent();
      tick();

      // Assert
      expect(mockToastService.error).toHaveBeenCalledWith('Invalid username or password');
    }));

    it('should not call authService.login when form invalid but should mark touched', fakeAsync(() => {
      // Arrange
      component.loginForm.controls['username'].setValue(''); // invalid
      component.loginForm.controls['password'].setValue(''); // invalid
      fixture.detectChanges();

      const markTouchedSpy = spyOn<any>(component, 'markFormGroupTouched').and.callThrough();

      // Act
      // Dispatch submit event instead of clicking disabled button to force onSubmit path
      page.submitFormViaEvent();
      tick();

      // Assert
      expect(markTouchedSpy).toHaveBeenCalled();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    }));
  });

  /**************************************************************************
   * Routing & lifecycle tests
   **************************************************************************/
  describe('Routing & lifecycle', () => {
    it('ngOnInit should navigate to returnUrl if already authenticated', () => {
      // Arrange
      mockAuthService.isAuthenticated.and.returnValue(true);

      // Act
      // Recreate component to re-run ngOnInit using updated spy
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith([component.returnUrl]);
    });

    it('should navigate to returnUrl from query param after login', fakeAsync(() => {
      // Arrange
      const customReturn = '/custom';
      mockActivatedRoute.snapshot.queryParams = { returnUrl: customReturn };

      // Recreate component so ngOnInit sees query param
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      page.fillForm(page.mockUsers[1].username, page.mockUsers[1].password); // manager
      mockAuthService.login.and.returnValue(of({}));
      fixture.detectChanges();

      // Act
      page.submitFormViaEvent();
      tick();

      // Assert
      expect(mockToastService.success).toHaveBeenCalledWith('Login successful');
      expect(mockRouter.navigate).toHaveBeenCalledWith([customReturn]);
    }));
  });
});
