import { TestBed } from '@angular/core/testing';

import { ConstanciaService } from './constancia.service';

describe('ConstanciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstanciaService = TestBed.get(ConstanciaService);
    expect(service).toBeTruthy();
  });
});
