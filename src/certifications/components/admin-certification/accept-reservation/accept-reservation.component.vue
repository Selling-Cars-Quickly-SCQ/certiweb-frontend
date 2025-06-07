<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { reservationService } from '@/certifications/services/reservation.service.js';
import { useI18n } from 'vue-i18n';
import languageSwitcherComponent from '../../../../public/components/language-switcher/language-switcher.component.vue';

const { t } = useI18n();
const pendingReservations = ref([]);
const isLoading = ref(true);
const error = ref(null);

const emit = defineEmits(['reservationAccepted']);

const loadPendingReservations = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const allReservations = await reservationService.getAllReservations();
    pendingReservations.value = allReservations.filter(res => res.status === 'pending');
  } catch (err) {
    console.error('Error loading pending reservations:', err);
    error.value = 'Failed to load reservations. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const acceptReservation = async (reservation) => {
  try {
    const updatedReservation = { ...reservation, status: 'accepted' };
    await reservationService.updateReservation(reservation.id, updatedReservation);
    emit('reservationAccepted', updatedReservation);
    await loadPendingReservations();
    alert('Reservation accepted successfully!');
  } catch (err) {
    console.error('Error accepting reservation:', err);
    alert('Failed to accept reservation.');
  }
};

onMounted(() => {
  loadPendingReservations();
});

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<template>
  <language-switcher-component/>
  <div class="reservation-container">
    <!-- Header Section -->
    <div class="header-section">
      <h2 class="main-title">
        <i class="pi pi-calendar-clock title-icon"></i>
        {{ t('acceptReservation.pendingReservations') }}
      </h2>
      <div class="title-underline"></div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner"></i>
      </div>
      <p class="loading-text">{{ t('acceptReservation.loadingReservations') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <div class="error-content">
        <i class="pi pi-exclamation-triangle error-icon"></i>
        <p class="error-message">{{ error }}</p>
        <pv-button 
          :label="t('acceptReservation.retry')" 
          icon="pi pi-refresh" 
          class="retry-button"
          @click="loadPendingReservations"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !error && pendingReservations.length === 0" class="empty-container">
      <div class="empty-content">
        <i class="pi pi-calendar-times empty-icon"></i>
        <h3 class="empty-title">{{ t('acceptReservation.noPendingReservations') }}</h3>
        <p class="empty-description">{{ t('acceptReservation.allProcessed') }}</p>
      </div>
    </div>

    <!-- Reservations Carousel -->
    <div v-if="!isLoading && !error && pendingReservations.length > 0" class="carousel-container">
      <pv-carousel 
        :value="pendingReservations" 
        :numVisible="3" 
        :numScroll="1" 
        :responsiveOptions="responsiveOptions"
        class="custom-carousel"
      >
        <template #item="slotProps">
          <div class="card-wrapper">
            <pv-card class="reservation-card">
              <template #title>
                <div class="card-title">
                  <i class="pi pi-car title-car-icon"></i>
                  {{ slotProps.data.reservationName || t('acceptReservation.notAvailable') }}
                </div>
              </template>
              
              <template #subtitle>
                <div class="vehicle-info">
                  <div class="info-row">
                    <span class="info-label">{{ t('acceptReservation.brand') }}:</span>
                    <span class="info-value">{{ slotProps.data.brand || t('acceptReservation.notAvailable') }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('acceptReservation.model') }}:</span>
                    <span class="info-value">{{ slotProps.data.model || t('acceptReservation.notAvailable') }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('acceptReservation.license') }}:</span>
                    <span class="info-value license-plate">{{ slotProps.data.licensePlate || t('acceptReservation.notAvailable') }}</span>
                  </div>
                </div>
              </template>
              
              <template #content>
                <div class="reservation-details">
                  <div class="detail-item">
                    <i class="pi pi-calendar detail-icon"></i>
                    <div class="detail-content">
                      <span class="detail-label">{{ t('acceptReservation.dateTime') }}</span>
                      <span class="detail-value">
                        {{ slotProps.data.inspectionDateTime ? 
                           new Date(slotProps.data.inspectionDateTime).toLocaleString() : t('acceptReservation.notAvailable') }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <i class="pi pi-dollar detail-icon"></i>
                    <div class="detail-content">
                      <span class="detail-label">{{ t('acceptReservation.price') }}</span>
                      <span class="detail-value price">S/ {{ slotProps.data.price || '0.00' }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <i class="pi pi-info-circle detail-icon"></i>
                    <div class="detail-content">
                      <span class="detail-label">{{ t('acceptReservation.status') }}</span>
                      <span class="status-badge status-pending">
                        <i class="pi pi-clock status-icon"></i>
                        {{ slotProps.data.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
              
              <template #footer>
                <pv-button 
                  :label="t('acceptReservation.acceptReservation')" 
                  icon="pi pi-check" 
                  class="accept-button"
                  @click="acceptReservation(slotProps.data)" 
                />
              </template>
            </pv-card>
          </div>
        </template>
      </pv-carousel>
    </div>
  </div>
</template>

<style scoped>
/* Container Styles */
.reservation-container {
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.main-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.title-icon {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.title-text {
  text-align: center;
  line-height: 1.2;
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  margin: 1rem auto;
  border-radius: 2px;
}

/* Loading Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 400px;
}

.loading-spinner {
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  text-align: center;
}

/* Error Styles */
.error-container {
  background: white;
  border-radius: 16px;
  padding: 2rem 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 6px solid #ef4444;
  margin: 0 auto;
  max-width: 500px;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 2.5rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-message {
  color: #dc2626;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.retry-button {
  background: #ef4444 !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  font-size: 0.9rem !important;
}

.retry-button:hover {
  background: #dc2626 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Empty State Styles */
.empty-container {
  background: white;
  border-radius: 16px;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 500px;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.empty-description {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* Carousel Styles */
.carousel-container {
  margin-top: 2rem;
}

.card-wrapper {
  padding: 0.5rem;
}

.reservation-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

/* Card Title */
.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.title-car-icon {
  color: #3b82f6;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.card-title-text {
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

/* Vehicle Info */
.vehicle-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 0.5rem;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #64748b;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.info-value {
  font-weight: 500;
  color: #1e293b;
  text-align: right;
  word-break: break-word;
  font-size: 0.9rem;
}

.license-plate {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #475569;
  font-size: 0.8rem;
}

/* Reservation Details */
.reservation-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.detail-icon {
  color: #3b82f6;
  font-size: 1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
  font-size: 0.9rem;
}

.price {
  font-size: 1rem;
  font-weight: 700;
  color: #059669;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fbbf24;
}

.status-icon {
  font-size: 0.75rem;
}

/* Accept Button */
.accept-button {
  width: 100% !important;
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
  padding: 0.875rem !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}

.accept-button:hover {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
}

.accept-button:active {
  transform: translateY(0);
}

/* Carousel Customization */
:deep(.p-carousel .p-carousel-content) {
  padding: 0.5rem 0;
}

:deep(.p-carousel .p-carousel-indicators) {
  padding: 1rem 0;
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #cbd5e1;
  border: none;
  transition: all 0.3s ease;
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button) {
  background-color: #3b82f6;
  transform: scale(1.2);
}

:deep(.p-carousel .p-carousel-prev),
:deep(.p-carousel .p-carousel-next) {
  background: white !important;
  color: #3b82f6 !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 50% !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

:deep(.p-carousel .p-carousel-prev:hover),
:deep(.p-carousel .p-carousel-next:hover) {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
  transform: scale(1.1);
}

/* Responsive Design */
@media (min-width: 576px) {
  .reservation-container {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .card-wrapper {
    padding: 0.75rem;
  }
  
  .loading-container,
  .error-container {
    padding: 2.5rem;
  }
}

@media (min-width: 768px) {
  .reservation-container {
    padding: 2rem;
  }
  
  .main-title {
    font-size: 2rem;
    flex-wrap: nowrap;
  }
  
  .header-section {
    margin-bottom: 2.5rem;
  }
  
  .card-wrapper {
    padding: 1rem;
  }
  
  .info-row {
    align-items: center;
  }
  
  .detail-item {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .loading-container,
  .error-container,
  .empty-container {
    padding: 3rem;
  }
  
  .title-underline {
    width: 100px;
  }
}

@media (min-width: 992px) {
  .main-title {
    font-size: 2.25rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .detail-value {
    font-size: 1rem;
  }
  
  .accept-button {
    font-size: 1rem !important;
    padding: 1rem !important;
  }
}

@media (min-width: 1200px) {
  .reservation-container {
    padding: 2.5rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .header-section {
    margin-bottom: 3rem;
  }
}

/* Animation for card entrance */
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

.reservation-card {
  animation: slideInUp 0.6s ease-out;
}

/* Smooth transitions for all interactive elements */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .reservation-card {
    border: 2px solid #000;
  }
  
  .main-title {
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>