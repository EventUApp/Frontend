import React, { useRef } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Spacing } from '../../theme';
import { AppInput } from '../ui/AppInput';

interface ServiceStepTermsProps {
  location: string;
  onLocationChange: (value: string) => void;
  capacity: string;
  onCapacityChange: (value: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  conditions: string;
  onConditionsChange: (value: string) => void;
}

/** Paso 3: ubicación, capacidad, duración y condiciones (foco encadenado). */
export const ServiceStepTerms: React.FC<ServiceStepTermsProps> = ({
  location,
  onLocationChange,
  capacity,
  onCapacityChange,
  duration,
  onDurationChange,
  conditions,
  onConditionsChange,
}) => {
  const locationRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const capacityRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const durationRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const conditionsRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  return (
    <View>
      <AppInput
        label="Ubicación y cobertura"
        value={location}
        onChangeText={onLocationChange}
        placeholder="Medellín y área metropolitana"
        returnKeyType="next"
        blurOnSubmit={false}
        inputRef={locationRef}
        onSubmitEditing={() => capacityRef.current?.focus()}
      />

      <View style={styles.row}>
        <AppInput
          label="Capacidad"
          value={capacity}
          onChangeText={onCapacityChange}
          placeholder="150 personas"
          containerStyle={styles.halfField}
          returnKeyType="next"
          blurOnSubmit={false}
          inputRef={capacityRef}
          onSubmitEditing={() => durationRef.current?.focus()}
        />
        <AppInput
          label="Duración"
          value={duration}
          onChangeText={onDurationChange}
          placeholder="4 horas"
          containerStyle={styles.halfFieldLast}
          returnKeyType="next"
          blurOnSubmit={false}
          inputRef={durationRef}
          onSubmitEditing={() => conditionsRef.current?.focus()}
        />
      </View>

      <AppInput
        label="Condiciones de reserva y cancelación"
        value={conditions}
        onChangeText={onConditionsChange}
        placeholder="Anticipo del 30%..."
        returnKeyType="done"
        inputRef={conditionsRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  halfField: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  halfFieldLast: {
    flex: 1,
  },
});
