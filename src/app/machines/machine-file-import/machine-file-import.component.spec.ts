import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineFileImportComponent } from './machine-file-import.component';

describe('MachineFileImportComponent', () => {
  let component: MachineFileImportComponent;
  let fixture: ComponentFixture<MachineFileImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineFileImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineFileImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
