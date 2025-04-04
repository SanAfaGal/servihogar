export interface WorkerProfile {
  id: string;
  first_name: string;
  middle_name?: string;
  first_last_name: string;
  second_last_name?: string;
  identification_type: string;
  identification_number: string;
  phone: string;
  email: string;
  location_city: string;
  location_neighborhood: string;
  years_experience: string;
  description: string;
  profile_picture_url?: string;
  availability: {
    [key: string]: string[];
  };
  certifications: {
    name: string;
    file_url: string;
  }[];
  portfolio_images: string[];
  social_links: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  terms_accepted: boolean;
  code_of_conduct_accepted: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export const CITIES = [
  'Medellín',
  'Bello',
  'Itagüí',
  'Envigado',
  'Sabaneta',
  'La Estrella',
  'Copacabana',
  'Girardota',
  'Barbosa',
  'Caldas'
] as const;

export type City = typeof CITIES[number];

export const YEARS_EXPERIENCE = [
  'Menos de 1 año',
  '1-3 años',
  '3-5 años',
  'Más de 5 años'
] as const;

export const ID_TYPES = [
  'Cédula de Ciudadanía',
  'Cédula de Extranjería',
  'Pasaporte'
] as const;

export type IdType = typeof ID_TYPES[number];
export type YearsExperience = typeof YEARS_EXPERIENCE[number];

export const TIME_SLOTS = [
  'Mañana (6AM-12PM)',
  'Tarde (12PM-6PM)',
  'Noche (6PM-10PM)'
] as const;

export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
] as const;