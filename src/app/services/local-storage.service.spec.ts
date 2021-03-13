import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Mocking local storage
    const store: { [index: string]: string | null } = {};
    const mockLocalStorage = {
      getItem: (key: string) => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        store[key] = null;
      },
    };
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store a value', () => {
    service.storeValue('key', 'value');
    expect(localStorage.getItem('key')).toEqual(JSON.stringify('value'));
  });

  it('should retrieve a stored value', () => {
    service.storeValue('key', 'value');
    expect(service.getValue('key')).toEqual('value');
  });

  it('should return null if no matching key found', () => {
    expect(service.getValue('no-key')).toBeNull();
  });

  it('should remove a stored value with matching key', () => {
    service.storeValue('key', 'value');
    expect(service.getValue('key')).toEqual('value');
    service.removeValue('key');
    expect(service.getValue('key')).toBeNull();
  });
});
