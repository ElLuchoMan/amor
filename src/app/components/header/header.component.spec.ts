import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ErrorLogModalComponent } from '../error-log-modal/error-log-modal.component';
import { ResourcesService } from '../../services/resources.service';
import { UUIDService } from '../../services/uuid.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let songsService: SongsService;
  let resourcesService: ResourcesService;
  let uuidService: UUIDService;
  let errorLoggingService: ErrorLoggingService;
  let modalService: NgbModal;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent
      ],
      providers: [
        SongsService,
        ResourcesService,
        UUIDService,
        ErrorLoggingService,
        ToastrService,
        NgbModal
      ]
    }).compileComponents();

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true
    });

    jest.spyOn(console, 'error').mockImplementation(() => { });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    songsService = TestBed.inject(SongsService);
    resourcesService = TestBed.inject(ResourcesService);
    uuidService = TestBed.inject(UUIDService);
    errorLoggingService = TestBed.inject(ErrorLoggingService);
    modalService = TestBed.inject(NgbModal);
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get UUID from songService on init', () => {
    const uuid = 'mock-uuid';
    jest.spyOn(uuidService, 'getUUID').mockReturnValue(uuid);
    component.ngOnInit();
    expect(component.user_id).toBe(uuid);
  });

  it('should copy UUID to clipboard', async () => {
    component.user_id = 'mock-uuid';
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await component.copyTokenToClipboard();
    expect(writeTextSpy).toHaveBeenCalledWith('mock-uuid');
  });

  it('should handle error when copying UUID to clipboard', async () => {
    component.user_id = 'mock-uuid';
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Clipboard error'));
    const openModalSpy = jest.spyOn(component, 'openModal');

    await component.copyTokenToClipboard();

    expect(writeTextSpy).toHaveBeenCalledWith('mock-uuid');
    expect(openModalSpy).toHaveBeenCalled();
  });

  it('should fetch logo on init', () => {
    const mockData = [{ type: 'logo', url: 'logo-url' }];
    jest.spyOn(resourcesService, 'listResources').mockReturnValue(of(mockData));
    const getUrlByTypeSpy = jest.spyOn(resourcesService, 'getUrlByType').mockReturnValue('logo-url');

    component.ngOnInit();

    expect(getUrlByTypeSpy).toHaveBeenCalledWith(mockData, 'logo');
    expect(component.logo).toBe('logo-url');
  });

  it('should open modal with error message', () => {
    const errorMessage = 'Test error message';
    const mockModalRef: NgbModalRef = {
      componentInstance: {
        errors: []
      }
    } as NgbModalRef;
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef);
    jest.spyOn(errorLoggingService, 'logError');
    jest.spyOn(errorLoggingService, 'getErrors').mockReturnValue(['Logged error']);

    component.openModal(errorMessage);

    expect(errorLoggingService.logError).toHaveBeenCalledWith(errorMessage);
    expect(modalService.open).toHaveBeenCalledWith(ErrorLogModalComponent);
    expect(mockModalRef.componentInstance.errors).toEqual(['Logged error']);
  });
});
