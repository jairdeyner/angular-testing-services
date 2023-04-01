import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from './../../environments/environment';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../models/product.model';

import { ProductService } from './product.service';
import {
  generateManyProducts,
  generateOneProduct,
} from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (done: DoneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // Act
      productService.getAllSimple().subscribe((data) => {
        // Assert
        expect(data.length).toBe(mockData.length);
        expect(data).toEqual(mockData);
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;

      expect(headers.get('Authorization')).toEqual('Bearer 123');

      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (done: DoneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(2);
      // Act
      productService.getAll().subscribe((data) => {
        // Assert
        expect(data.length).toBe(mockData.length);
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (done: DoneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * 0.19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * 0.19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * 0.19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = 0
        },
      ];

      // Act
      productService.getAll().subscribe((data) => {
        // Assert
        expect(data.length).toBe(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3', (done: DoneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts();
      const limit = 10;
      const offset = 3;

      // Act
      productService.getAll(limit, offset).subscribe((data) => {
        // Assert
        expect(data.length).toBe(mockData.length);
        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

      const params = req.request.params;

      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('test for create', () => {
    it('should return a new product', (done: DoneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const { id, category, ...rest }: Product = mockData;

      const dto: CreateProductDTO = { ...rest, categoryId: 12 };
      // Act
      productService.create({ ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);

        done();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      };
      const productId = '1';
      // Act
      productService.update(productId, { ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);

      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';
      // Act
      productService.delete(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      expect(req.request.method).toEqual('DELETE');

      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();

      const productId = '1';
      // Act
      productService.getOne(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      expect(req.request.method).toEqual('GET');

      req.flush(mockData);
    });

    it('should return the right msg when the status code is 404', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      expect(req.request.method).toEqual('GET');

      req.flush(msgError, mockError);
    });
  });
});
