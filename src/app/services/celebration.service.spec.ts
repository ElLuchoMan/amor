import { TestBed } from '@angular/core/testing';

import { CelebrationService } from './celebration.service';

describe('CelebrationService', () => {
  let service: CelebrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CelebrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger birthday celebration', (done) => {
    service.showBalloons$.subscribe(show => {
      if (show) {
        expect(show).toBeTruthy();
        done();
      }
    });
    
    service.triggerBirthdayCelebration();
  });

  it('should check birthday correctly', () => {
    const today = new Date();
    const isBirthday = service.checkForBirthday(today);
    expect(isBirthday).toBeTruthy();
  });
});
