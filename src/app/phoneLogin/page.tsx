'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Lock, User, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from "@/components/ui/checkbox";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '../../../src/firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const PhoneLogin = () => {
  const [step, setStep] = useState('disclaimer');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier && step === 'phone') {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {},
        'expired-callback': () => {
          setError('El captcha ha expirado. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }, [step]);

  const handleDisclaimerAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    setStep('phone');
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const phoneRegex = /^[6-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('Por favor, introduce un número de teléfono válido');
      setIsLoading(false);
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA no inicializado');
      }

      const formattedPhone = '+34' + phone;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setStep('verify');
    } catch (err) {
      console.error('Error al enviar SMS:', err);
      setError('Error al enviar el código. Por favor, verifica el número e inténtalo de nuevo.');
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      setIsLoading(false);
      return;
    }

    try {
      if (!confirmationResult) {
        throw new Error('No hay sesión de verificación activa');
      }

      await confirmationResult.confirm(code);
      setStep('profile');
    } catch (err) {
      console.error('Error al verificar código:', err);
      setError('Código incorrecto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (name.length < 3) {
      setError('Por favor, introduce tu nombre completo');
      setIsLoading(false);
      return;
    }

    try {
      await updateUserProfile({
        displayName: name,
        createdAt: new Date().toISOString(),
      });
      
      router.push('/');
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 'disclaimer' && 'Términos de Uso'}
            {step === 'phone' && 'Acceso con teléfono'}
            {step === 'verify' && 'Verificar número'}
            {step === 'profile' && 'Completa tu perfil'}
          </CardTitle>
          <CardDescription>
            {step === 'disclaimer' && 'Por favor, lee y acepta los términos antes de continuar'}
            {step === 'phone' && 'Introduce tu número de teléfono para recibir un código'}
            {step === 'verify' && 'Introduce el código que has recibido por SMS'}
            {step === 'profile' && 'Por favor, introduce tu nombre completo'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'disclaimer' && (
            <>
              <div className="text-xs text-gray-500 mt-4 space-y-2">
                <p className="font-semibold text-red-600">AVISO IMPORTANTE:</p>
                <p>
                  Esta aplicación ha sido desarrollada de manera urgente y gratuita en respuesta a la 
                  situación de emergencia causada por la DANA en Paiporta. El desarrollador, Carlos 
                  Raez Campos con DNI 29206136T, ha creado esta herramienta con la mejor intención 
                  de ayudar a la comunidad, pero:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>NO se hace responsable de ningún fallo o mal funcionamiento de la aplicación.</li>
                  <li>NO garantiza la disponibilidad continua del servicio.</li>
                  <li>NO asume responsabilidad por pérdida de datos o cualquier perjuicio derivado del uso de la aplicación.</li>
                </ul>
                <p>
                  Al utilizar esta aplicación:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Aceptas que tus datos serán almacenados y procesados con el único fin de 
                  facilitar la coordinación de ayuda durante la emergencia.</li>
                  <li>Entiendes que la aplicación puede contener errores o fallos debido a su 
                  rápido desarrollo.</li>
                  <li>Reconoces que el desarrollador no tiene ninguna responsabilidad legal sobre 
                  el funcionamiento de la aplicación.</li>
                  <li>Aceptas que tus datos sean visibles para otros usuarios de la aplicación con 
                  el único fin de coordinar la ayuda.</li>
                </ul>
                <p className="font-medium">
                  Todos los datos serán tratados según la LOPD y serán eliminados una vez finalizada 
                  la situación de emergencia.
                </p>
              </div>
              <form onSubmit={handleDisclaimerAccept} className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms} 
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    He leído y acepto los términos y condiciones
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={!acceptTerms}>
                  Continuar
                </Button>
              </form>
            </>
          )}

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Teléfono (ej: 666555444)"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={9}
                  required
                />
              </div>
              <div id="recaptcha-container" className="mb-4"></div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerification} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  className="pl-10 text-center tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Verificar código'}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  setStep('phone');
                  if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                  }
                }}
              >
                Cambiar número de teléfono
              </Button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Completar registro'}
              </Button>
            </form>
          )}
        </CardContent>

        {step !== 'disclaimer' && (
          <CardFooter className="text-xs text-gray-500 pt-4">
            <Info className="h-4 w-4 mr-2" />
            Al continuar, aceptas los términos y condiciones de uso.
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PhoneLogin;

