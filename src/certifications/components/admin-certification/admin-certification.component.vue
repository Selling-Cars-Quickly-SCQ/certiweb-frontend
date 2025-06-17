<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AcceptReservationComponent from './accept-reservation/accept-reservation.component.vue';
import AdFormComponent from './ad-form/ad-form.component.vue';
import UploadCertificationComponent from './upload-certification/upload-certification.component.vue';
import { carService } from '@/certifications/services/car.service.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const acceptedReservationData = ref(null);
const adFormData = ref({});
const createdCarId = ref(null);
const isSavingCar = ref(false);
const isUploadingPdfStatus = ref(false);

const router = useRouter();

const handleReservationAccepted = (reservationData) => {
  acceptedReservationData.value = reservationData;
  createdCarId.value = null;
};

const handleAdFormUpdate = (data) => {
  adFormData.value = data;
};

const handleSaveCarData = async (formData) => {
  if (!acceptedReservationData.value) {
    alert(t('adminCertification.alertReservationNeeded'));
    return;
  }
   
  isSavingCar.value = true;
   
  try {
    if (!acceptedReservationData.value.brand || !acceptedReservationData.value.model) {
      throw new Error('Marca y modelo son requeridos');
    }
 
    const brandMapping = {
      'toyota': 1,
      'nissan': 2,
      'hyundai': 3,
      'kia': 4,
      'chevrolet': 5,
      'suzuki': 6,
      'mitsubishi': 7,
      'honda': 8,
      'volkswagen': 9,
      'ford': 10,
      'mercedes': 11,
      'mercedes-benz': 11,
      'audi': 12,
      'bmw': 13
    };
  
    const brandName = acceptedReservationData.value.brand.toLowerCase().trim();
    const correctBrandId = brandMapping[brandName];
     
    if (!correctBrandId) {
      throw new Error(`Marca no reconocida: ${acceptedReservationData.value.brand}`);
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year) || currentYear;
    if (year < 1900 || year > currentYear + 1) {
      throw new Error(`El año debe estar entre 1900 y ${currentYear + 1}`);
    }

    const licensePlate = acceptedReservationData.value.licensePlate;
    if (!licensePlate || licensePlate.length < 6 || licensePlate.length > 10) {
      throw new Error('La placa debe tener entre 6 y 10 caracteres');
    }

    const price = parseFloat(acceptedReservationData.value.price) || 0;
    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    
    let pdfCertification = null;
    if (formData.pdfCertification && typeof formData.pdfCertification === 'string') {
      
      pdfCertification = formData.pdfCertification;
      console.log('PDF con prefijo para crear auto:', pdfCertification.substring(0, 50));
    } else {
      pdfCertification = '';
    }
  
    const carDataPayload = {
      title: formData.title || `${acceptedReservationData.value.brand} ${acceptedReservationData.value.model}`,
      owner: acceptedReservationData.value.reservationName,
      ownerEmail: acceptedReservationData.value.reservationEmail,
      year: year,
      brandId: correctBrandId,
      model: acceptedReservationData.value.model,
      description: formData.description || '',
      pdfCertification: pdfCertification,
      imageUrl: acceptedReservationData.value.imageUrl || 'https://via.placeholder.com/300x200.png?text=Car+Image',
      price: price,
      licensePlate: licensePlate,
      originalReservationId: parseInt(acceptedReservationData.value.id)
    };
 
    const requiredFields = ['title', 'owner', 'ownerEmail', 'year', 'brandId', 'model', 'licensePlate', 'originalReservationId'];
    for (const field of requiredFields) {
      if (!carDataPayload[field] && carDataPayload[field] !== 0) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }
   
    console.log('Guardando datos del auto:', carDataPayload);
       
    const response = await carService.createCar(carDataPayload);
     
    if (response && (response.id || response.data?.id)) {
      createdCarId.value = response.id || response.data.id;
      console.log('Auto creado exitosamente con ID:', createdCarId.value);
      alert(t('adminCertification.alertCarSaved'));
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
   
  } catch (error) {
    console.error('Error al guardar el auto:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    alert(t('adminCertification.alertSaveCarError') + ': ' + errorMessage);
  } finally {
    isSavingCar.value = false;
  }
};

const handlePdfUploaded = async (payload) => {
  if (!payload || !payload.carId || !payload.pdfCertification) {
    console.error('Payload inválido para subir PDF');
    return;
  }

  const pdfToSend = payload.pdfCertification;
  
  console.log('PDF a enviar - Longitud:', pdfToSend.length);
  console.log('PDF a enviar - Primeros 50 chars:', pdfToSend.substring(0, 50));
  console.log('Verificación de prefijo:', pdfToSend.startsWith('data:application/pdf;base64,') ? 'CORRECTO - TIENE PREFIJO' : 'ERROR - SIN PREFIJO');

  isUploadingPdfStatus.value = true;
  
  try {
    await carService.updateCar(payload.carId, {
      pdfCertification: pdfToSend 
    });
    
    console.log(`PDF para el auto ${payload.carId} actualizado con éxito con prefijo completo.`);
    alert(t('adminCertification.alertPdfUploaded'));
    
  } catch (error) {
    console.error('Error al actualizar el PDF del auto:', error);
    alert(t('adminCertification.alertPdfUploadError') + error.message);
  } finally {
    isUploadingPdfStatus.value = false;
  }
};

const completedSteps = computed(() => {
  let steps = 0;
  if (acceptedReservationData.value) steps++;
  if (createdCarId.value) steps++;
  return steps;
});

const resetProcess = () => {
  acceptedReservationData.value = null;
  adFormData.value = {};
  createdCarId.value = null;
  isSavingCar.value = false;
  isUploadingPdfStatus.value = false;
};

const handleLogout = () => {
  localStorage.removeItem('currentSession');
  router.push('/login');
};
</script>

<template>
  <div class="admin-certification-container">
    <!-- Progress Indicator -->
    <div class="progress-indicator">
      <div class="progress-header">
        <h2 class="progress-title">
          <i class="pi pi-cog"></i>
          {{ t('adminCertification.processTitle') }}
        </h2>
        <div class="progress-stats">
          <span class="steps-completed">{{ t('adminCertification.stepsCompleted', { completedSteps }) }}</span>
          <pv-button 
            v-if="completedSteps > 0"
            :label="t('adminCertification.resetProcess')" 
            icon="pi pi-refresh" 
            class="p-button-text p-button-sm p-button-raised p-button-info"
            @click="resetProcess"
          />
          <pv-button 
            :label="t('adminCertification.logout')" 
            icon="pi pi-sign-out" 
            class="p-button-text p-button-sm p-button-danger"
            @click="handleLogout"
          />
        </div>
      </div>
      
      <div class="progress-steps">
        <div class="step" :class="{ 'completed': acceptedReservationData, 'active': !acceptedReservationData }">
          <div class="step-icon">
            <i class="pi pi-check" v-if="acceptedReservationData"></i>
            <span v-else>1</span>
          </div>
          <span class="step-label">{{ t('adminCertification.step1') }}</span>
        </div>
        
        <div class="step-connector" :class="{ 'completed': acceptedReservationData }"></div>
        
        <div class="step" :class="{
          'completed': createdCarId, 
          'active': acceptedReservationData && !createdCarId
        }">
          <div class="step-icon">
            <i class="pi pi-check" v-if="createdCarId"></i>
            <span v-else>2</span>
          </div>
          <span class="step-label">{{ t('adminCertification.step2') }}</span>
        </div>
        
        <div class="step-connector" :class="{ 'completed': createdCarId }"></div>
        
        <div class="step" :class="{
          'completed': false,
          'active': createdCarId
        }">
          <div class="step-icon">
            <span>3</span>
          </div>
          <span class="step-label">{{ t('adminCertification.step3') }}</span>
        </div>
      </div>
    </div>

    <!-- Components -->
    <div class="components-container">
      <!-- Step 1: Accept Reservation -->
      <div class="component-section">
        <div class="step-header">
          <h3 class="step-title">
            <span class="step-number">1</span>
            {{ t('adminCertification.step1Title') }}
          </h3>
          <div v-if="acceptedReservationData" class="step-status completed">
            <i class="pi pi-check-circle"></i>
            <span>{{ t('adminCertification.step1Completed') }}</span>
          </div>
        </div>
        <AcceptReservationComponent @reservationAccepted="handleReservationAccepted" />
      </div>
      
      <!-- Step 2: Fill Form and Save -->
      <div class="component-section" :class="{ 'disabled': !acceptedReservationData }">
        <div class="step-header">
          <h3 class="step-title">
            <span class="step-number">2</span>
            {{ t('adminCertification.step2Title') }}
          </h3>
          <div v-if="createdCarId" class="step-status completed">
            <i class="pi pi-check-circle"></i>
            <span>{{ t('adminCertification.step2CarId', { createdCarId }) }}</span>
          </div>
          <div v-else-if="!acceptedReservationData" class="step-status disabled">
            <i class="pi pi-lock"></i>
            <span>{{ t('adminCertification.step2Locked') }}</span>
          </div>
        </div>
        <AdFormComponent 
          :initialData="acceptedReservationData" 
          @update:formData="handleAdFormUpdate" 
          @saveCar="handleSaveCarData"
          :isSaving="isSavingCar"
        />
      </div>
      
      <!-- Step 3: Upload PDF -->
      <div class="component-section" :class="{ 'disabled': !createdCarId }">
        <div class="step-header">
          <h3 class="step-title">
            <span class="step-number">3</span>
            {{ t('adminCertification.step3Title') }}
          </h3>
          <div v-if="!createdCarId" class="step-status disabled">
            <i class="pi pi-lock"></i>
            <span>{{ t('adminCertification.step3Locked') }}</span>
          </div>
        </div>
        <UploadCertificationComponent 
          v-if="createdCarId" 
          :carId="createdCarId" 
          @pdfUploaded="handlePdfUploaded" 
          :isUploadingPdf="isUploadingPdfStatus"
        />
        <div v-else class="placeholder-message">
          <div class="placeholder-content">
            <i class="pi pi-upload"></i>
            <h4>{{ t('adminCertification.pdfUploadLocked') }}</h4>
            <p>{{ t('adminCertification.completePreviousSteps') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container Styles */
.admin-certification-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Progress Indicator */
.progress-indicator {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.progress-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.progress-title i {
  color: #3b82f6;
  font-size: 1.5rem;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Reducido para mejor ajuste */
  background: #f1f5f9;
  padding: 0.75rem 1rem; /* Ajustado padding */
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

/* Asegurar que los botones no se superpongan demasiado */
.progress-stats .p-button-sm {
  margin-left: 0.5rem;
}

.steps-completed {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 3px solid #e2e8f0;
  background: white;
  color: #94a3b8;
}

.step.completed .step-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
  color: white;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.step.active .step-icon {
  border-color: #3b82f6;
  background: #f0f9ff;
  color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.step-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-align: center;
  white-space: nowrap;
}

.step.completed .step-label {
  color: #059669;
}

.step.active .step-label {
  color: #3b82f6;
}

.step-connector {
  width: 8rem;
  height: 3px;
  background: #e2e8f0;
  position: relative;
  z-index: 1;
  transition: all 0.5s ease;
}

.step-connector.completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

/* Components Container */
.components-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.component-section {
  position: relative;
  transition: all 0.3s ease;
}

.component-section.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Step Headers */
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.step-number {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
}

.step-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.step-status.completed {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.step-status.disabled {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Placeholder Message */
.placeholder-message {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 2px dashed #d1d5db;
  margin-top: 1rem;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.placeholder-content i {
  font-size: 3rem;
  color: #d1d5db;
}

.placeholder-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.placeholder-content p {
  font-size: 1rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-certification-container {
    padding: 1.5rem;
  }
  
  .progress-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .step-connector {
    width: 4rem;
  }
}

@media (max-width: 768px) {
  .admin-certification-container {
    padding: 1rem;
  }
  
  .progress-indicator {
    padding: 1.5rem;
  }
  
  .progress-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-connector {
    width: 3px;
    height: 2rem;
    transform: rotate(90deg);
  }
  
  .step-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .progress-title {
    font-size: 1.25rem;
  }
  
  .step-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .step-label {
    font-size: 0.8rem;
  }
}

/* Animation for component entrance */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-indicator,
.component-section {
  animation: slideInUp 0.6s ease-out;
}

.component-section:nth-child(1) { animation-delay: 0.1s; }
.component-section:nth-child(2) { animation-delay: 0.2s; }
.component-section:nth-child(3) { animation-delay: 0.3s; }
</style>