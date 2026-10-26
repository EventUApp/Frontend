import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { StepEnter, StepExit } from '../../constants/animations';
import { useAppStore } from '../../store/useAppStore';
import { mockCategories } from '../../mocks';
import { Colors, Spacing, BorderRadius } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  StepIndicator,
  AppButton,
} from '../../components';
import { ServiceStepBasics } from '../../components/provider-portal/ServiceStepBasics';
import { ServiceStepDetails } from '../../components/provider-portal/ServiceStepDetails';
import { ServiceStepTerms } from '../../components/provider-portal/ServiceStepTerms';
import { ServiceCategoryId } from '../../types';

const STEPS = [
  { number: 1, label: 'Básico' },
  { number: 2, label: 'Detalles' },
  { number: 3, label: 'Condiciones' },
];

const TOTAL_STEPS = STEPS.length;

/** Controlador del wizard: estado del formulario y navegación por pasos. */
export default function ServiceEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { providerServices, createProviderService, updateProviderService, currentUser } = useAppStore();

  const isEditing = !!id;
  const existingService = isEditing ? providerServices.find((s) => s.id === id) : undefined;

  const [step, setStep] = useState(1);
  const [name, setName] = useState(existingService?.name || '');
  const [category, setCategory] = useState<ServiceCategoryId>(existingService?.category || 'fotografia');
  const [price, setPrice] = useState(existingService ? existingService.price.toString() : '350000');
  const [priceUnit, setPriceUnit] = useState(existingService?.priceUnit || 'por evento');
  const [shortDescription, setShortDescription] = useState(existingService?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(existingService?.fullDescription || '');
  const [includesText, setIncludesText] = useState(
    existingService ? existingService.includes.join('\n') : '2 horas de cobertura\n80 fotografías editadas\nGalería privada'
  );
  const [notIncludesText, setNotIncludesText] = useState(
    existingService ? existingService.notIncludes.join('\n') : 'Álbum impreso empastado\nHoras extra'
  );
  const [location, setLocation] = useState(existingService?.location || 'Área Metropolitana');
  const [duration, setDuration] = useState(existingService?.duration || '3 horas');
  const [capacity, setCapacity] = useState(existingService?.capacity || 'Hasta 150 personas');
  const [conditions, setConditions] = useState(
    existingService?.conditions || '30% anticipo. Cancelación gratuita con 15 días de aviso.'
  );

  const isLast = step === TOTAL_STEPS;

  const handleSave = (publish: boolean = true) => {
    if (!name.trim() || !price) {
      Alert.alert('Faltan datos', 'Por favor ingresa al menos nombre y precio del servicio.');
      return;
    }

    const catObj = mockCategories.find((c) => c.id === category);

    const payload = {
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      name,
      category,
      categoryName: catObj?.name || 'Servicio',
      price: parseInt(price, 10) || 100000,
      priceUnit,
      shortDescription,
      fullDescription,
      includes: includesText.split('\n').filter((l) => l.trim().length > 0),
      notIncludes: notIncludesText.split('\n').filter((l) => l.trim().length > 0),
      location,
      duration,
      capacity,
      conditions,
      available: publish,
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      ],
    };

    if (isEditing && id) {
      updateProviderService(id, payload);
      Alert.alert('Actualizado', 'Servicio actualizado correctamente.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    } else {
      createProviderService({
        ...payload,
        rating: 5.0,
        reviewCount: 0,
      });
      Alert.alert('Publicado', 'Tu nuevo servicio ha sido publicado en el marketplace.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title={isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View key={`step-${step}`} entering={StepEnter} exiting={StepExit}>
            <View style={styles.card}>
              {step === 1 && (
                <ServiceStepBasics
                  name={name}
                  onNameChange={setName}
                  category={category}
                  onCategoryChange={setCategory}
                  price={price}
                  onPriceChange={setPrice}
                  priceUnit={priceUnit}
                  onPriceUnitChange={setPriceUnit}
                />
              )}
              {step === 2 && (
                <ServiceStepDetails
                  shortDescription={shortDescription}
                  onShortDescriptionChange={setShortDescription}
                  fullDescription={fullDescription}
                  onFullDescriptionChange={setFullDescription}
                  includesText={includesText}
                  onIncludesTextChange={setIncludesText}
                  notIncludesText={notIncludesText}
                  onNotIncludesTextChange={setNotIncludesText}
                />
              )}
              {step === 3 && (
                <ServiceStepTerms
                  location={location}
                  onLocationChange={setLocation}
                  capacity={capacity}
                  onCapacityChange={setCapacity}
                  duration={duration}
                  onDurationChange={setDuration}
                  conditions={conditions}
                  onConditionsChange={setConditions}
                />
              )}

              <View style={styles.btnRow}>
                {step > 1 && (
                  <AppButton
                    title="Anterior"
                    variant="outline"
                    size="md"
                    onPress={handleBack}
                    style={styles.backBtn}
                  />
                )}
                {!isLast ? (
                  <AppButton
                    title="Siguiente"
                    variant="primary"
                    size="lg"
                    icon="arrow-forward"
                    iconPosition="right"
                    onPress={() => setStep(step + 1)}
                    style={styles.nextBtn}
                  />
                ) : (
                  <>
                    <AppButton
                      title="Guardar y Publicar"
                      icon="checkmark-circle-outline"
                      size="lg"
                      onPress={() => handleSave(true)}
                      style={styles.publishBtn}
                    />
                    <AppButton
                      title="Pausado"
                      variant="outline"
                      size="lg"
                      onPress={() => handleSave(false)}
                      style={styles.pausedBtn}
                    />
                  </>
                )}
              </View>
            </View>
          </Animated.View>
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
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
  backBtn: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  nextBtn: {
    flex: 1,
  },
  publishBtn: {
    flex: 1.4,
    marginRight: Spacing.sm,
  },
  pausedBtn: {
    flex: 1,
  },
});
