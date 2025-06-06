<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AcceptReservationComponent from './accept-reservation/accept-reservation.component.vue';
import AdFormComponent from './ad-form/ad-form.component.vue';
import UploadCertificationComponent from './upload-certification/upload-certification.component.vue';
import { carService } from '@/certifications/services/car.service.js';

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
    alert('Primero debe aceptar una reserva');
    return;
  }

  isSavingCar.value = true;

  try {
    const carDataPayload = {
      ...formData,
      originalReservationId: acceptedReservationData.value.id,
      pdfCertification: {},
      price: acceptedReservationData.value.price,
      imageUrl: acceptedReservationData.value.imageUrl || 'https://via.placeholder.com/300x200.png?text=Car+Image',
      licensePlate: acceptedReservationData.value.licensePlate
    };

    console.log('Guardando datos del auto:', carDataPayload);
    
    const newCar = await carService.createCar(carDataPayload);
    createdCarId.value = newCar.id || newCar.data?.id;
    
    console.log('Auto creado exitosamente con ID:', createdCarId.value);
    alert('Información del vehículo guardada exitosamente. Ahora puede subir el PDF.');

  } catch (error) {
    console.error('Error al guardar el auto:', error);
    alert('Error al guardar la información del vehículo: ' + error.message);
  } finally {
    isSavingCar.value = false;
  }
};

const handlePdfUploaded = async (payload) => {
  if (!payload || !payload.carId || !payload.pdfCertification) {
    console.error('Payload inválido para subir PDF');
    return;
  }

  isUploadingPdfStatus.value = true;
  
  try {
    await carService.updateCar(payload.carId, { 
      pdfCertification: payload.pdfCertification 
    });
    
    console.log(`PDF para el auto ${payload.carId} actualizado con éxito.`);
    alert('PDF subido exitosamente a la base de datos');
    
  } catch (error) {
    console.error('Error al actualizar el PDF del auto:', error);
    alert('Error al subir el PDF: ' + error.message);
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
          Proceso de Certificación
        </h2>
        <div class="progress-stats">
          <span class="steps-completed">{{ completedSteps }}/3 pasos completados</span>
          <pv-button 
            v-if="completedSteps > 0"
            label="Reiniciar Proceso" 
            icon="pi pi-refresh" 
            class="p-button-text p-button-sm p-button-raised p-button-info"
            @click="resetProcess"
          />
          <pv-button 
            label="Cerrar Sesión" 
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
          <span class="step-label">Aceptar Reserva</span>
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
          <span class="step-label">Guardar Información</span>
        </div>
        
        <div class="step-connector" :class="{ 'completed': createdCarId }"></div>
        
        <div class="step" :class="{ 
          'completed': false,
          'active': createdCarId
        }">
          <div class="step-icon">
            <span>3</span>
          </div>
          <span class="step-label">Subir PDF</span>
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
            Aceptar Reserva
          </h3>
          <div v-if="acceptedReservationData" class="step-status completed">
            <i class="pi pi-check-circle"></i>
            <span>Completado</span>
          </div>
        </div>
        <AcceptReservationComponent @reservationAccepted="handleReservationAccepted" />
      </div>
      
      <!-- Step 2: Fill Form and Save -->
      <div class="component-section" :class="{ 'disabled': !acceptedReservationData }">
        <div class="step-header">
          <h3 class="step-title">
            <span class="step-number">2</span>
            Completar y Guardar Información
          </h3>
          <div v-if="createdCarId" class="step-status completed">
            <i class="pi pi-check-circle"></i>
            <span>Auto ID: {{ createdCarId }}</span>
          </div>
          <div v-else-if="!acceptedReservationData" class="step-status disabled">
            <i class="pi pi-lock"></i>
            <span>Bloqueado</span>
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
            Subir Informe Técnico PDF
          </h3>
          <div v-if="!createdCarId" class="step-status disabled">
            <i class="pi pi-lock"></i>
            <span>Primero guarde la información del auto</span>
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
            <h4>Subida de PDF Bloqueada</h4>
            <p>Complete los pasos anteriores para habilitar la subida del PDF</p>
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