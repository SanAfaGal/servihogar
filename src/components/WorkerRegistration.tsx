import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { ServiceCategory, City, IdType, YearsExperience } from '../types/worker';
import { AlertCircle, Upload, Trash2, HelpCircle } from 'lucide-react';
import { CITIES, DAYS_OF_WEEK, ID_TYPES, TIME_SLOTS, YEARS_EXPERIENCE } from '../types/worker';

function WorkerRegistration() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    first_last_name: '',
    second_last_name: '',
    identification_type: '' as IdType,
    identification_number: '',
    phone: '',
    email: '',
    location_city: '' as City,
    location_neighborhood: '',
    years_experience: '' as YearsExperience,
    description: '',
    profile_picture_url: '',
    selectedCategories: [] as string[],
    availability: {} as Record<string, string[]>,
    portfolio_images: [] as string[],
    certifications: [] as { name: string; file_url: string }[],
    social_links: {
      website: '',
      instagram: '',
      facebook: '',
      linkedin: ''
    },
    terms_accepted: false,
    code_of_conduct_accepted: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('services_categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar las categorías de servicio');
    }
  };

  const validateIdNumber = (type: string, number: string) => {
    switch (type) {
      case 'Cédula de Ciudadanía':
        return /^\d{8,10}$/.test(number) ? '' : 'La cédula debe tener entre 8 y 10 dígitos';
      case 'Cédula de Extranjería':
        return /^\d{6,12}$/.test(number) ? '' : 'La cédula de extranjería debe tener entre 6 y 12 dígitos';
      case 'Pasaporte':
        return /^[A-Z0-9]{6,12}$/.test(number) ? '' : 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos';
      default:
        return '';
    }
  };

  const validatePhone = (phone: string) => {
    return /^(\+57|57)?[3][0-9]{9}$/.test(phone) 
      ? '' 
      : 'Ingrese un número de teléfono colombiano válido (ej: +573001234567)';
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ''
      : 'Ingrese un correo electrónico válido';
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'first_name':
      case 'first_last_name':
        return value.trim() ? '' : 'Este campo es obligatorio';
      case 'identification_number':
        return validateIdNumber(formData.identification_type, value);
      case 'phone':
        return validatePhone(value);
      case 'email':
        return validateEmail(value);
      default:
        return '';
    }
  };

  const handleFieldChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (typeof value === 'string') {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.first_name) errors.first_name = 'El nombre es obligatorio';
    if (!formData.first_last_name) errors.first_last_name = 'El primer apellido es obligatorio';
    if (!formData.identification_type) errors.identification_type = 'Seleccione un tipo de identificación';
    if (!formData.identification_number) {
      errors.identification_number = 'El número de identificación es obligatorio';
    } else {
      const idError = validateIdNumber(formData.identification_type, formData.identification_number);
      if (idError) errors.identification_number = idError;
    }
    
    if (!formData.phone) {
      errors.phone = 'El teléfono es obligatorio';
    } else {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) errors.phone = phoneError;
    }

    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }

    if (!formData.location_city) errors.location_city = 'Seleccione una ciudad';
    if (formData.selectedCategories.length === 0) {
      errors.categories = 'Seleccione al menos una categoría de servicio';
    }
    if (!formData.profile_picture_url) {
      errors.profile_picture = 'La foto de perfil es obligatoria';
    }
    if (!formData.terms_accepted || !formData.code_of_conduct_accepted) {
      errors.terms = 'Debe aceptar los términos y el código de conducta';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Por favor corrija los errores en el formulario');
      // Scroll to first error
      const firstError = Object.keys(fieldErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user?.id) throw new Error('No se encontró ID de usuario');

      // Update profile
      const profileData = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        first_last_name: formData.first_last_name,
        second_last_name: formData.second_last_name,
        identification_type: formData.identification_type,
        identification_number: formData.identification_number,
        phone: formData.phone,
        email: formData.email,
        location_city: formData.location_city,
        location_neighborhood: formData.location_neighborhood,
        years_experience: formData.years_experience,
        description: formData.description,
        profile_picture_url: formData.profile_picture_url,
        availability: formData.availability,
        portfolio_images: formData.portfolio_images,
        certifications: formData.certifications,
        social_links: formData.social_links,
        terms_accepted: formData.terms_accepted,
        code_of_conduct_accepted: formData.code_of_conduct_accepted,
        is_worker: true
      };

      await updateProfile(profileData);

      // Add service categories
      const { error: categoriesError } = await supabase
        .from('worker_services')
        .insert(
          formData.selectedCategories.map(categoryId => ({
            worker_id: user.id,
            category_id: categoryId
          }))
        );

      if (categoriesError) throw categoriesError;

      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'portfolio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('worker-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('worker-images')
        .getPublicUrl(filePath);

      if (type === 'profile') {
        setFormData(prev => ({
          ...prev,
          profile_picture_url: publicUrl
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          portfolio_images: [...prev.portfolio_images, publicUrl]
        }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error al subir la imagen. Por favor intente nuevamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Registro de Trabajador</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Primer Nombre *
              </label>
              <input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={e => handleFieldChange('first_name', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.first_name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {fieldErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                Segundo Nombre
              </label>
              <input
                id="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={e => handleFieldChange('middle_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="first_last_name" className="block text-sm font-medium text-gray-700">
                Primer Apellido *
              </label>
              <input
                id="first_last_name"
                type="text"
                value={formData.first_last_name}
                onChange={e => handleFieldChange('first_last_name', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.first_last_name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {fieldErrors.first_last_name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.first_last_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">
                Segundo Apellido
              </label>
              <input
                id="second_last_name"
                type="text"
                value={formData.second_last_name}
                onChange={e => handleFieldChange('second_last_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="identification_type" className="block text-sm font-medium text-gray-700">
                Tipo de Identificación *
              </label>
              <select
                id="identification_type"
                value={formData.identification_type}
                onChange={e => handleFieldChange('identification_type', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.identification_type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione tipo</option>
                {ID_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {fieldErrors.identification_type && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.identification_type}</p>
              )}
            </div>

            <div>
              <label htmlFor="identification_number" className="block text-sm font-medium text-gray-700">
                Número de Identificación *
              </label>
              <input
                id="identification_number"
                type="text"
                value={formData.identification_number}
                onChange={e => handleFieldChange('identification_number', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.identification_number ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {fieldErrors.identification_number && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.identification_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono *
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+573XXXXXXXXX"
                value={formData.phone}
                onChange={e => handleFieldChange('phone', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleFieldChange('email', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
                Ciudad *
              </label>
              <select
                id="location_city"
                value={formData.location_city}
                onChange={e => handleFieldChange('location_city', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.location_city ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione ciudad</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {fieldErrors.location_city && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.location_city}</p>
              )}
            </div>

            <div>
              <label htmlFor="location_neighborhood" className="block text-sm font-medium text-gray-700">
                Barrio
              </label>
              <input
                id="location_neighborhood"
                type="text"
                value={formData.location_neighborhood}
                onChange={e => handleFieldChange('location_neighborhood', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil *
              </label>
              {formData.profile_picture_url ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.profile_picture_url}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, profile_picture_url: '' }))}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                    <Upload className="w-8 h-8 text-blue-600" />
                    <span className="mt-2 text-base leading-normal">Seleccionar foto</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'profile')}
                    />
                  </label>
                </div>
              )}
              {fieldErrors.profile_picture && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.profile_picture}</p>
              )}
            </div>
          </div>
        </section>

        {/* Professional Profile */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Perfil Profesional</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Ofrecidos *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.selectedCategories.includes(category.id)}
                        onChange={e => {
                          const newCategories = e.target.checked
                            ? [...formData.selectedCategories, category.id]
                            : formData.selectedCategories.filter(id => id !== category.id);
                          setFormData({...formData, selectedCategories: newCategories});
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{category.name}</label>
                      <p className="text-gray-500">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {fieldErrors.categories && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.categories}</p>
              )}
            </div>

            <div>
              <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
                Años de Experiencia *
              </label>
              <select
                id="years_experience"
                value={formData.years_experience}
                onChange={e => handleFieldChange('years_experience', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione experiencia</option>
                {YEARS_EXPERIENCE.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción Profesional
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                placeholder="Cuéntanos sobre tus habilidades y experiencia..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad
              </label>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="flex items-center space-x-4">
                    <span className="w-24">{day}</span>
                    <div className="flex flex-wrap gap-4">
                      {TIME_SLOTS.map(slot => (
                        <label key={slot} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.availability[day]?.includes(slot) || false}
                            onChange={e => {
                              const newAvailability = { ...formData.availability };
                              if (!newAvailability[day]) newAvailability[day] = [];
                              if (e.target.checked) {
                                newAvailability[day].push(slot);
                              } else {
                                newAvailability[day] = newAvailability[day].filter(s => s !== slot);
                              }
                              setFormData({...formData, availability: newAvailability});
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio & Experience */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Portafolio y Experiencia</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes de Trabajos Realizados
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {formData.portfolio_images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          portfolio_images: formData.portfolio_images.filter((_, i) => i !== index)
                        });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <span className="mt-2 text-base leading-normal">Agregar imagen</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'portfolio')}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redes Sociales
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Sitio Web</label>
                  <input
                    type="url"
                    value={formData.social_links.website}
                    onChange={e => setFormData({
                      ...formData,
                      social_links: {...formData.social_links, website: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Instagram</label>
                  <input
                    type="text"
                    value={formData.social_links.instagram}
                    onChange={e => setFormData({
                      ...formData,
                      social_links: {...formData.social_links, instagram: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Facebook</label>
                  <input
                    type="text"
                    value={formData.social_links.facebook}
                    onChange={e => setFormData({
                      ...formData,
                      social_links: {...formData.social_links, facebook: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.social_links.linkedin}
                    onChange={e => setFormData({
                      ...formData,
                      social_links: {...formData.social_links, linkedin: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agreement & Terms */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Términos y Condiciones</h2>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.terms_accepted}
                onChange={e => handleFieldChange('terms_accepted', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los términos y condiciones
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.code_of_conduct_accepted}
                onChange={e => handleFieldChange('code_of_conduct_accepted', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Acepto el código de conducta profesional
              </span>
            </label>

            {fieldErrors.terms && (
              <p className="text-sm text-red-600">{fieldErrors.terms}</p>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Completar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkerRegistration;