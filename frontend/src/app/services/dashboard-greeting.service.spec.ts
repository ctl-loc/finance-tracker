import { TestBed } from '@angular/core/testing';

import { DashboardGreetingService } from './dashboard-greeting.service';

describe('DashboardGreetingService', () => {
  let service: DashboardGreetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardGreetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
