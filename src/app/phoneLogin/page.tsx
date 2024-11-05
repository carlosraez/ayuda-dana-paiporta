import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Lock, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PhoneLogin = () => {
  const [step, setStep] = useState('phone'); 
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica del teléfono
    const phoneRegex = /^[6-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('Por favor, introduce un número de teléfono válido');
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la llamada a tu API para enviar el SMS
      // Por ahora simulamos un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('verify');
    } catch (err) {
      setError('Error al enviar el código. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la verificación del código
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('profile');
    } catch (err) {
      setError('Código incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (name.length < 3) {
      setError('Por favor, introduce tu nombre completo');
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría el guardado del perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirigir al usuario a la página principal o donde sea necesario
      window.location.href = '/';
    } catch (err) {
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
            {step === 'phone' && 'Acceso con teléfono'}
            {step === 'verify' && 'Verificar número'}
            {step === 'profile' && 'Completa tu perfil'}
          </CardTitle>
          <CardDescription>
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
                onClick={() => setStep('phone')}
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
      </Card>
    </div>
  );
};

export default PhoneLogin;