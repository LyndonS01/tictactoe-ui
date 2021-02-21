import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellsComponent } from './cells.component';

describe('CellsComponent', () => {
  let component: CellsComponent;
  let fixture: ComponentFixture<CellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // click on Human saves Human as opponent
  it('should save human as opponent', () => {
    expect(component.opponent).toEqual('');
    expect(component.opponentSelected).toBe(false);
    component.humanButtonClicked();
    expect(component.opponentSelected).toBe(true);
    expect(component.opponent).toEqual('Human');
  });

  // click on Computer saves Computer as opponent
  it('should save computer as opponent', () => {
    expect(component.opponent).toEqual('');
    expect(component.opponentSelected).toBe(false);
    component.cpuButtonClicked();
    expect(component.opponentSelected).toBe(true);
    expect(component.opponent).toEqual('Computer');
  });

  // click on Reset restarts the game
  it('should save computer as opponent', () => {
    component.resetButtonClicked();
    expect(component.opponentSelected).toBe(false);
    expect(component.opponent).toEqual('');
  });
});
