import { TestBed } from '@angular/core/testing';

import { Resultat } from './resultat';

describe('Resultat', () => {
  let service: Resultat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resultat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
