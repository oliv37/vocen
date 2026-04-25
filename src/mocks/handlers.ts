import { http, HttpResponse } from 'msw';
import { Translation } from '@core/translations/translation.model';

const INIT_TRANSLATIONS: Readonly<Translation[]> = [
  { id: 1, en: 'straightforward', fr: ['direct', 'franc'] },
  { id: 2, en: 'awkward', fr: ['gênant', 'embarrassant'] },
];

let translations: Translation[] = [...INIT_TRANSLATIONS];

export const resetTranslations = () => {
  translations = [...INIT_TRANSLATIONS];
};

export const handlers = [
  http.get('/api/translations', () => {
    return HttpResponse.json(translations);
  }),

  http.post('/api/translations', async ({ request }) => {
    const newTranslation = (await request.json()) as Omit<Translation, 'id'>;

    const id = translations.length + 1;
    const translation: Translation = { ...newTranslation, id };
    translations = [...translations, translation];

    return HttpResponse.json(translation, { status: 201 });
  }),

  http.put('/api/translations/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedTranslation = (await request.json()) as Translation;

    translations = translations.map((t) => (t.id === Number(id) ? updatedTranslation : t));

    return HttpResponse.json({ ...updatedTranslation, id: Number(id) }, { status: 200 });
  }),

  http.delete('/api/translations/:id', ({ params }) => {
    const { id } = params;
    translations = translations.filter((t) => t.id !== Number(id));

    return new HttpResponse(null, { status: 204 });
  }),
];
