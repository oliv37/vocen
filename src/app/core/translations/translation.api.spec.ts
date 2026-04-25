import { TestBed } from '@angular/core/testing';

import { TranslationApi } from './translation.api';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Translation } from './translation.model';

describe('TranslationApi', () => {
  let translationApi: TranslationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), TranslationApi],
    });
    translationApi = TestBed.inject(TranslationApi);
  });

  it('should get Translations', async () => {
    // Act
    const translations = await firstValueFrom(translationApi.getTranslations());

    // Assert
    expect(translations).toHaveLength(2);

    expect(translations[0].id).toBe(1);
    expect(translations[0].en).toBe('straightforward');
    expect(translations[0].fr).toEqual(['direct', 'franc']);

    expect(translations[1].id).toBe(2);
    expect(translations[1].en).toBe('awkward');
    expect(translations[1].fr).toEqual(['gênant', 'embarrassant']);
  });

  it('should create a translation', async () => {
    // Arrange
    const newTranslation: Omit<Translation, 'id'> = {
      en: 'clumsy',
      fr: ['maladroit'],
    };

    // Act
    const result = await firstValueFrom(translationApi.createTranslation(newTranslation));

    // Assert
    expect(result).toEqual({
      id: 3,
      en: 'clumsy',
      fr: ['maladroit'],
    });
  });

  it('should update an existing translation', async () => {
    // Arrange
    const updatedTranslation: Translation = { id: 2, en: 'awkward', fr: ['maladroit'] };

    // Act
    const result = await firstValueFrom(translationApi.updateTranslation(updatedTranslation));

    // Assert
    expect(result).toEqual({
      id: 2,
      en: 'awkward',
      fr: ['maladroit'],
    });
  });

  it('should delete a translation', async () => {
    // Act & Assert
    await expect(firstValueFrom(translationApi.deleteTranslation(1))).resolves.not.toThrow();
  });
});
