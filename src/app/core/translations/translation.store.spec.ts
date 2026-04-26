import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslationApi } from './translation.api';
import { TranslationStore } from './translation.store';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { waitFor } from '@testing-library/angular';

describe('TranslationStore', () => {
  let httpTesting: HttpTestingController;
  let store: InstanceType<typeof TranslationStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslationApi,
        TranslationStore,
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    store = TestBed.inject(TranslationStore);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load translations on init', async () => {
    const req = httpTesting.expectOne('/api/translations');

    expect(req.request.method).toBe('GET');

    expect(store.translations()).toEqual([]);
    expect(store.isLoading()).toBe(true);
    expect(store.isLoaded()).toBe(false);
    expect(store.error()).toBeNull();

    req.flush([{ id: 1, en: 'awkward', fr: ['malaroit'] }]);

    await waitFor(() => {
      expect(store.isLoading()).toBe(false);
      expect(store.isLoaded()).toBe(true);
      expect(store.translations()).toEqual([{ id: 1, en: 'awkward', fr: ['malaroit'] }]);
      expect(store.error()).toBeNull();
    });
  });

  it('should handle error when loading translations fails', async () => {
    const req = httpTesting.expectOne('/api/translations');

    expect(req.request.method).toBe('GET');

    expect(store.translations()).toEqual([]);
    expect(store.isLoading()).toBe(true);
    expect(store.isLoaded()).toBe(false);
    expect(store.error()).toBeNull();

    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    await waitFor(() => {
      expect(store.translations()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.isLoaded()).toBe(false);
      expect(store.error()).toEqual('Server Error');
    });
  });

  it('should not trigger a second request if one is already pending', async () => {
    httpTesting.expectOne('/api/translations');

    store.load();

    httpTesting.expectNone('/api/translations');
  });

  it('should handle network error (status 0)', async () => {
    const req = httpTesting.expectOne('/api/translations');

    req.error(new ProgressEvent('Network error'));

    await waitFor(() => {
      expect(store.translations()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.isLoaded()).toBe(false);
      expect(store.error()).toBe('Serveur injoignable.');
    });
  });
});
