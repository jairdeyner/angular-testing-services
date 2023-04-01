import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService],
    });

    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return a token', (done: DoneFn) => {
      // Arrange
      const mockData: Auth = { access_token: '122112' };
      const email = 'jair@gmail.com';
      const password = '1234';

      // Act
      authService.login(email, password).subscribe((data) => {
        // Assert
        expect(data).toBe(mockData);
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);

      req.flush(mockData);
    });

    it('should call to saveToken', (done: DoneFn) => {
      // Arrange
      const mockData: Auth = { access_token: '122112' };
      const email = 'jair@gmail.com';
      const password = '1234';

      // Para métodos que no retornan nada
      // No ejecuta el metodo, no lalma a la funcion real
      spyOn(tokenService, 'saveToken').and.callThrough();

      // Act
      authService.login(email, password).subscribe((data) => {
        // Assert
        expect(data).toBe(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith('122112');
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);

      req.flush(mockData);
    });
  });
});
