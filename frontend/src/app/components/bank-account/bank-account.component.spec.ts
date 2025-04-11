import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountComponent } from './bank-account.component';

describe('BankAccountComponent', () => {
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
