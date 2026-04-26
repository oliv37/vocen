import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { TranslationApi } from './translation.api';
import { Translation } from './translation.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type TranslationState = {
  translations: Translation[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

const initialState: TranslationState = {
  translations: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

export const TranslationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, translationApi = inject(TranslationApi)) => ({
    load: rxMethod<void>(
      pipe(
        exhaustMap(() => {
          patchState(store, { isLoading: true, error: null });

          return translationApi.getTranslations().pipe(
            tapResponse({
              next: (data) =>
                patchState(store, {
                  translations: data,
                  isLoaded: true,
                  isLoading: false,
                }),
              error: (err: HttpErrorResponse) => {
                console.error(err);

                patchState(store, {
                  error: getErrorMessage(err),
                  isLoading: false,
                });
              },
            }),
          );
        }),
      ),
    ),
  })),

  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);

function getErrorMessage(err: HttpErrorResponse): string {
  if (typeof err.error === 'string') {
    return err.error;
  }

  if (err.error?.message) {
    return err.error.message;
  }

  if (err.status === 0) {
    return 'Serveur injoignable.';
  }

  return 'Erreur de chargement des données.';
}
