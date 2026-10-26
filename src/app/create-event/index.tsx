import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { StepEnter, StepExit } from '../../constants/animations';
import { useAppStore } from '../../store/useAppStore';
import { mockEventTypes, mockServices } from '../../mocks';
import { Colors, Spacing } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  StepIndicator,
  AppButton,
} from '../../components';
import { Service } from '../../types';
import { StepBasics } from '../../components/create-event/StepBasics';
import { StepSize } from '../../components/create-event/StepSize';
import { StepServices } from '../../components/create-event/StepServices';
import { StepReview } from '../../components/create-event/StepReview';

const STEPS = [
  { number: 1, label: 'Básico' },
  { number: 2, label: 'Magnitud' },
  { number: 3, label: 'Servicios' },
  { number: 4, label: 'Resumen' },
];

const TOTAL_STEPS = STEPS.length;

/** Controlador del wizard: posee el estado y renderiza el paso activo.
    Cada paso vive en `src/components/create-event/`. */
export default function CreateEventWizardScreen() {
  const { setCartDetails, addServiceToCart, saveCartAsQuote, clearCart } = useAppStore();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(mockEventTypes[0]);
  const [name, setName] = useState('Mi Celebración Especial');
  const [date, setDate] = useState('2026-11-20');
  const [location, setLocation] = useState('Medellín, Antioquia');
  const [guests, setGuests] = useState('75');
  const [budget, setBudget] = useState('3000000');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'salones',
    'fotografia',
    'decoracion',
  ]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([
    mockServices[0],
    mockServices[2],
    mockServices[4],
  ]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleService = (srv: Service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === srv.id)
        ? prev.filter((s) => s.id !== srv.id)
        : [...prev, srv]
    );
  };

  const estimatedTotal = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  const isLast = step === TOTAL_STEPS;

  const handleFinish = () => {
    setCartDetails({
      name,
      typeId: selectedType.id,
      typeName: selectedType.name,
      date,
      location,
      guestCount: parseInt(guests, 10) || 50,
      budget: parseInt(budget, 10) || 2000000,
    });
    clearCart();
    selectedServices.forEach((s) => addServiceToCart(s, 1));
    const saved = saveCartAsQuote();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/quote/${saved.id}`);
  };

  const handleNext = () => {
    if (!isLast) setStep(step + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title="Crear Evento"
        subtitle={`Paso ${step} de ${TOTAL_STEPS}: ${STEPS[step - 1].label}`}
        showBack
        onBack={handleBack}
      />
      <StepIndicator
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        steps={STEPS}
        onSelectStep={(targetStep) => {
          if (targetStep <= step) setStep(targetStep);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View key={`step-${step}`} entering={StepEnter} exiting={StepExit}>
            {step === 1 && (
              <StepBasics
                selectedType={selectedType}
                onSelectType={setSelectedType}
                name={name}
                onNameChange={setName}
                date={date}
                onDateChange={setDate}
                location={location}
                onLocationChange={setLocation}
              />
            )}
            {step === 2 && (
              <StepSize
                guests={guests}
                onGuestsChange={setGuests}
                budget={budget}
                onBudgetChange={setBudget}
              />
            )}
            {step === 3 && (
              <StepServices
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                selectedServices={selectedServices}
                onToggleService={toggleService}
              />
            )}
            {step === 4 && (
              <StepReview
                name={name}
                typeName={selectedType.name}
                date={date}
                location={location}
                guests={guests}
                services={selectedServices}
                estimatedTotal={estimatedTotal}
              />
            )}
          </Animated.View>
          <View style={styles.btnRow}>
            {step > 1 && (
              <AppButton
                title="Anterior"
                variant="outline"
                size="md"
                onPress={handleBack}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
            )}
            <AppButton
              title={isLast ? 'Guardar y Ver Cotización' : 'Siguiente'}
              variant="primary"
              size="lg"
              icon={isLast ? 'checkmark' : 'arrow-forward'}
              iconPosition="right"
              onPress={handleNext}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
});
