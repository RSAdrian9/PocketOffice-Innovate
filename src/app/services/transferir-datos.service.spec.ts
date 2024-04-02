import { TestBed } from '@angular/core/testing';

import { TransferirDatosService } from './transferir-datos.service';

describe('TransferirDatosService', () => {
  let service: TransferirDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferirDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
