import React, { useState } from 'react';
import { AppInput, AppInputProps } from './AppInput';

export const PasswordInput: React.FC<Omit<AppInputProps, 'rightIcon' | 'onRightIconPress'>> = (
  props
) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppInput
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
      // Sin esto el botón se anuncia solo como "botón" y el usuario no
      // sabe si puede leer lo que escribió.
      rightIconLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      onRightIconPress={() => setShowPassword((prev) => !prev)}
    />
  );
};