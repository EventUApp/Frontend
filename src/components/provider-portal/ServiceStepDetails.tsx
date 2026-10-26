import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppInput } from '../ui/AppInput';

interface ServiceStepDetailsProps {
  shortDescription: string;
  onShortDescriptionChange: (value: string) => void;
  fullDescription: string;
  onFullDescriptionChange: (value: string) => void;
  includesText: string;
  onIncludesTextChange: (value: string) => void;
  notIncludesText: string;
  onNotIncludesTextChange: (value: string) => void;
}

/** Paso 2: descripciones e incluye / no incluye (multilínea: sin encadenado). */
export const ServiceStepDetails: React.FC<ServiceStepDetailsProps> = ({
  shortDescription,
  onShortDescriptionChange,
  fullDescription,
  onFullDescriptionChange,
  includesText,
  onIncludesTextChange,
  notIncludesText,
  onNotIncludesTextChange,
}) => {
  return (
    <View>
      <AppInput
        label="Descripción corta"
        value={shortDescription}
        onChangeText={onShortDescriptionChange}
        placeholder="Resumen atractivo para la card..."
      />

      <AppInput
        label="Descripción detallada"
        value={fullDescription}
        onChangeText={onFullDescriptionChange}
        placeholder="Explica a fondo en qué consiste el servicio..."
        multiline
        numberOfLines={3}
        style={styles.tallInput}
      />

      <AppInput
        label="¿Qué incluye? (Un elemento por línea)"
        value={includesText}
        onChangeText={onIncludesTextChange}
        placeholder="Elemento 1&#10;Elemento 2"
        multiline
        numberOfLines={3}
        style={styles.tallInput}
      />

      <AppInput
        label="¿Qué NO incluye? (Un elemento por línea)"
        value={notIncludesText}
        onChangeText={onNotIncludesTextChange}
        placeholder="Elemento no incluido 1"
        multiline
        numberOfLines={2}
        style={styles.shortInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tallInput: {
    height: 75,
    textAlignVertical: 'top',
  },
  shortInput: {
    height: 60,
    textAlignVertical: 'top',
  },
});
