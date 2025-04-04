import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const RESEND_COOLDOWN = 60; // segundos

export function useAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isSignUp, setIsSignUp] = useState(() => {
    // Leer el estado inicial de la navegación
    return location.state?.isSignUp ?? false;
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        // Si es un registro nuevo, redirigir al formulario de registro
        if (isSignUp) {
          navigate('/worker-registration');
        } else {
          // Si es inicio de sesión, redirigir al perfil
          navigate('/profile');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isSignUp]);

  // Actualizar isSignUp cuando cambia la navegación
  useEffect(() => {
    setIsSignUp(location.state?.isSignUp ?? isSignUp);
  }, [location.state]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      showToast('Por favor ingrese un correo electrónico válido', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { 
          shouldCreateUser: isSignUp,
        }
      });
      
      if (error) {
        if (error.message.includes("already registered") && isSignUp) {
          showToast("Este correo ya está registrado. Por favor, inicia sesión.", 'error');
        } else if (!isSignUp && error.message.includes("not found")) {
          showToast("Este correo no está registrado. Por favor, regístrate primero.", 'error');
        } else {
          showToast(`Error al enviar el enlace: ${error.message}`, 'error');
        }
      } else {
        setIsEmailSent(true);
        setResendCountdown(RESEND_COOLDOWN);
        showToast(
          isSignUp 
            ? "Te hemos enviado un enlace para completar tu registro" 
            : "Te hemos enviado un enlace para iniciar sesión",
          'success'
        );
      }
    } catch (err) {
      console.error("Authentication error:", err);
      showToast("Error durante la autenticación", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!validateEmail(formData.email) || resendCountdown > 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { 
          shouldCreateUser: isSignUp,
        }
      });
      
      if (error) {
        showToast(`Error al reenviar el enlace: ${error.message}`, 'error');
      } else {
        showToast("Se ha reenviado el enlace mágico", 'success');
        setResendCountdown(RESEND_COOLDOWN);
      }
    } catch (err) {
      console.error("Error resending email:", err);
      showToast("Error al reenviar el correo", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setIsEmailSent(false);
  };

  return {
    isSignUp,
    loading,
    formData,
    isEmailSent,
    resendCountdown,
    handleSendVerificationCode,
    handleResendEmail,
    handleFormChange,
    toggleSignUp,
  };
}