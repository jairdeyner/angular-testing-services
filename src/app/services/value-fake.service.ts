export class FakeValueService {
  constructor() {}

  getValue(): string {
    return 'fake value';
  }

  setValue(value: string): void {}

  getPromiseValue(): Promise<string> {
    return Promise.resolve('fake promise value');
  }
}
