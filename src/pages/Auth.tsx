import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isSignUp,
    loading,
    formData,
    isEmailSent,
    resendCountdown,
    handleSendVerificationCode,
    handleResendEmail,
    handleFormChange,
    toggleSignUp,
  } = useAuthForm();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Barra superior móvil */}
      <div className="md:hidden flex items-center h-16 px-4 bg-white shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900">
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Título para pantallas medianas y grandes */}
          <div className="hidden md:block text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Crear una cuenta' : 'Iniciar sesión'}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <AuthForm
              loading={loading}
              formData={formData}
              isEmailSent={isEmailSent}
              onSubmit={handleSendVerificationCode}
              onChange={handleFormChange}
            />

            {isEmailSent && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700">
                      {isSignUp 
                        ? "Te hemos enviado un enlace para completar tu registro a:"
                        : "Te hemos enviado un enlace de acceso a:"}
                    </p>
                    <p className="mt-1 text-sm text-blue-600 break-all">
                      {formData.email}
                    </p>
                    <div className="mt-4">
                      {resendCountdown > 0 ? (
                        <p className="text-sm text-blue-600">
                          Podrás reenviar el enlace en {resendCountdown} segundos
                        </p>
                      ) : (
                        <button
                          onClick={handleResendEmail}
                          disabled={loading}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                          Reenviar enlace
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={toggleSignUp}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isSignUp
                  ? '¿Ya tienes una cuenta? Inicia sesión'
                  : '¿No tienes una cuenta? Regístrate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}