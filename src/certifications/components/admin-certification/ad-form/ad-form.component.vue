<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isSaving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:formData', 'saveCar']);

const formData = ref({
  title: '',
  owner: '',
  ownerEmail: '',
  year: null,
  brand: '',
  model: '',
  description: '',
  pdfCertification: {},
  imageUrl: '',
  price: '',
  licensePlate: ''
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value.owner = newData.reservationName || '';
    formData.value.ownerEmail = newData.reservationEmail || ''; 
    formData.value.brand = newData.brand || '';
    formData.value.model = newData.model || '';
    formData.value.imageUrl = newData.imageUrl || '';
    formData.value.price = newData.price || '';
    formData.value.licensePlate = newData.licensePlate || '';
  }
}, { immediate: true });

watch(formData, (newData) => {
  emit('update:formData', newData);
}, { deep: true });

const isFormValid = computed(() => {
  const currentYear = new Date().getFullYear();
  const year = formData.value.year;
  const licensePlate = formData.value.licensePlate;
  
  return formData.value.title &&
         formData.value.owner &&
         formData.value.ownerEmail &&
         year !== null && year >= 1900 && year <= currentYear + 1 &&
         formData.value.brand &&
         formData.value.model &&
         formData.value.description &&
         licensePlate && licensePlate.length >= 6 && licensePlate.length <= 10;
});

const formProgress = computed(() => {
  const fields = [
    formData.value.title,
    formData.value.owner,
    formData.value.ownerEmail,
    formData.value.year !== null ? 'filled' : '',
    formData.value.brand,
    formData.value.model,
    formData.value.description
  ];
  const filledFields = fields.filter(field => field && field.toString().trim()).length;
  return Math.round((filledFields / fields.length) * 100);
});

const handleSaveCar = () => {
  if (isFormValid.value) {
    emit('saveCar', formData.value);
  }
};

defineExpose({
  formData,
  isFormValid
});
</script>

<template>
  <div class="form-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="pi pi-megaphone"></i>
        </div>
        <div class="header-text">
          <h1 class="main-title">{{ t('adForm.creationTitle') }}</h1>
          <p class="subtitle">{{ t('adForm.creationSubtitle') }}</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">{{ t('adForm.formProgress') }}</span>
          <span class="progress-percentage">{{ formProgress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: formProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-content">
      <div class="section-header">
        <i class="pi pi-car section-icon"></i>
        <h2 class="section-title">{{ t('adForm.vehicleAdData') }}</h2>
      </div>

      <div class="form-grid">
        <!-- Título del anuncio -->
        <div class="field-group full-width">
          <div class="field-header">
            <label for="title" class="field-label">
              <i class="pi pi-tag label-icon"></i>
              {{ t('adForm.adTitle') }}
            </label>
            <span class="field-badge editable">{{ t('adForm.editable') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-inputText
              id="title"
              v-model="formData.title"
              class="form-input editable-input"
              :placeholder="t('adForm.adTitlePlaceholder')"
            />
            <div class="input-hint">
              <i class="pi pi-info-circle"></i>
              <span>{{ t('adForm.adTitleHint') }}</span>
            </div>
          </div>
        </div>

        <!-- owner -->
        <div class="field-group">
          <div class="field-header">
            <label for="owner" class="field-label">
              <i class="pi pi-user label-icon"></i>
              {{ t('adForm.owner') }}
            </label>
            <span class="field-badge readonly">{{ t('adForm.autoCompleted') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-inputText
              id="owner"
              v-model="formData.owner"
              class="form-input readonly-input"
              :placeholder="t('adForm.ownerPlaceholder')"
              readonly
            />
            <div class="readonly-indicator">
              <i class="pi pi-lock"></i>
            </div>
          </div>
        </div>

        <!-- Owner Email -->
        <div class="field-group">
          <div class="field-header">
            <label for="ownerEmail" class="field-label">
              <i class="pi pi-envelope label-icon"></i>
              {{ t('adForm.ownerEmail') }}
            </label>
            <span class="field-badge readonly">{{ t('adForm.autoCompleted') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-inputText
              id="ownerEmail"
              v-model="formData.ownerEmail"
              class="form-input readonly-input" 
              :placeholder="t('adForm.ownerEmailPlaceholder')"
              readonly
            />
            <div class="readonly-indicator">
              <i class="pi pi-lock"></i>
            </div>
          </div>
        </div>

        <!-- Año -->
        <div class="field-group">
          <div class="field-header">
            <label for="year" class="field-label">
              <i class="pi pi-calendar label-icon"></i>
              {{ t('adForm.year') }}
            </label>
            <span class="field-badge editable">{{ t('adForm.editable') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-input-number
              id="year"
              v-model="formData.year"
              class="form-input editable-input"
              :placeholder="t('adForm.yearPlaceholder')"
              :useGrouping="false"
              mode="decimal"
              :maxlength="4"
              :min="1900"
              :max="new Date().getFullYear() + 1"
            />
             <div class="input-hint">
              <i class="pi pi-info-circle"></i>
              <span>{{ t('adForm.yearHint') }}</span>
            </div>
          </div>
        </div>

        <!-- brand -->
        <div class="field-group">
          <div class="field-header">
            <label for="brand" class="field-label">
              <i class="pi pi-bookmark label-icon"></i>
              {{ t('adForm.brand') }}
            </label>
            <span class="field-badge readonly">{{ t('adForm.autoCompleted') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-inputText
              id="brand"
              v-model="formData.brand"
              class="form-input readonly-input"
              :placeholder="t('adForm.brandPlaceholder')"
              readonly
            />
            <div class="readonly-indicator">
              <i class="pi pi-lock"></i>
            </div>
          </div>
        </div>

        <!-- model -->
        <div class="field-group">
          <div class="field-header">
            <label for="model" class="field-label">
              <i class="pi pi-cog label-icon"></i>
              {{ t('adForm.model') }}
            </label>
            <span class="field-badge readonly">{{ t('adForm.autoCompleted') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-inputText
              id="model"
              v-model="formData.model"
              class="form-input readonly-input"
              :placeholder="t('adForm.modelPlaceholder')"
              readonly
            />
            <div class="readonly-indicator">
              <i class="pi pi-lock"></i>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div class="field-group full-width">
          <div class="field-header">
            <label for="description" class="field-label">
              <i class="pi pi-file-edit label-icon"></i>
              {{ t('adForm.detailedDescription') }}
            </label>
            <span class="field-badge editable">{{ t('adForm.editable') }}</span>
          </div>
          <div class="input-wrapper">
            <pv-textarea
              id="description"
              v-model="formData.description"
              class="form-textarea editable-input"
              rows="5"
              :placeholder="t('adForm.descriptionPlaceholder')"
            />
            <div class="textarea-counter">
              <span>{{ formData.description?.length || 0 }} {{ t('adForm.characters') }}</span>
            </div>
            <div class="input-hint">
              <i class="pi pi-lightbulb"></i>
              <span>{{ t('adForm.descriptionHint') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="form-actions">
        <pv-button 
          :label="t('adForm.saveVehicleInfo')"
          icon="pi pi-save"
          class="p-button-primary p-button-lg save-button"
          @click="handleSaveCar"
          :disabled="!isFormValid || props.isSaving"
          :loading="props.isSaving"
        />
      </div>

      <!-- Form Status -->
      <div class="form-status" :class="{ 'valid': isFormValid }">
        <div class="status-content">
          <div class="status-icon">
            <i :class="isFormValid ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
          </div>
          <div class="status-text">
            <span class="status-title">
              {{ isFormValid ? t('adForm.formComplete') : t('adForm.formIncomplete') }}
            </span>
            <span class="status-description">
              {{ isFormValid
                ? t('adForm.allFieldsCompleted') 
                : t('adForm.completeEditableFields') 
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container Styles */
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.form-header {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.header-text {
  flex: 1;
}

.main-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Progress Section */
.progress-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.progress-percentage {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Form Content */
.form-content {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-icon {
  color: #3b82f6;
  font-size: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

/* Field Header */
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.label-icon {
  color: #3b82f6;
  font-size: 0.9rem;
}

.field-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-badge.editable {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fbbf24;
}

.field-badge.readonly {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
}

.readonly-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.9rem;
  pointer-events: none;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.input-hint i {
  color: #3b82f6;
}

.textarea-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* Form Actions */
.form-actions {
  margin-top: 2.5rem;
  text-align: center;
}

.save-button {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
  padding: 1.25rem 2.5rem !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
  transition: all 0.3s ease !important;
}

.save-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5) !important;
}

.save-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* Form Status */
.form-status {
  margin-top: 2.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #fbbf24;
  background: #fef3c7;
  transition: all 0.3s ease;
}

.form-status.valid {
  border-color: #10b981;
  background: #d1fae5;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-icon {
  font-size: 1.5rem;
  color: #d97706;
}

.form-status.valid .status-icon {
  color: #10b981;
}

.status-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-title {
  font-weight: 600;
  color: #92400e;
  font-size: 1rem;
}

.form-status.valid .status-title {
  color: #065f46;
}

.status-description {
  font-size: 0.9rem;
  color: #a16207;
}

.form-status.valid .status-description {
  color: #047857;
}

/* PrimeVue Component Overrides */
:deep(.form-input) {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

:deep(.form-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.editable-input) {
  background: #fffbeb !important;
  border-color: #fbbf24;
}

:deep(.editable-input:focus) {
  background: white !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.readonly-input) {
  background: #f9fafb !important;
  color: #6b7280 !important;
  cursor: not-allowed;
  border-color: #d1d5db;
}

:deep(.form-textarea) {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fffbeb;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

:deep(.form-textarea:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }
  
  .form-header,
  .form-content {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .field-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>