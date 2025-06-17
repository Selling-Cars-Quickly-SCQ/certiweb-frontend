<script setup>
import { defineProps } from 'vue';
import { Reservation } from '@/certifications/model/reservation.entity.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
    default: () => new Reservation()
  }
});

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Fecha no especificada';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Fecha inválida';
  }
};

const placeholderImage = 'https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg';
const handleImageError = (event) => {
  event.target.src = placeholderImage;
};
</script>

<template>
  <pv-card class="history-item-card">
    <template #header>
      <img
        :src="reservation.imageUrl || placeholderImage"
        :alt="t('historyItem.imageAlt')"
        class="vehicle-image"
        @error="handleImageError"
      />
    </template>
    <template #title>
      <div class="card-title">{{ reservation.reservationName || t('historyItem.noName') }}</div>
    </template>
    <template #subtitle>
      <div class="card-subtitle">{{ reservation.brand }} - {{ reservation.model }}</div>
    </template>
    <template #content>
      <div class="reservation-details">
        <p><strong>{{ t('historyItem.dateTime') }}</strong> {{ formatDateTime(reservation.inspectionDateTime) }}</p>
        <p><strong>{{ t('historyItem.price') }}</strong> S/ {{ reservation.price || t('historyItem.priceNotSpecified') }}</p>
        <p><strong>{{ t('historyItem.status') }}</strong> <span :class="`status-${reservation.status?.toLowerCase()}`">{{ reservation.status || t('historyItem.statusNotSpecified') }}</span></p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.history-item-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1.5rem;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.history-item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e4d2b, #2d6b3f);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.history-item-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.history-item-card:hover::before {
  transform: scaleX(1);
}

.vehicle-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
  background: #f8f9fa;
}

.history-item-card:hover .vehicle-image {
  transform: scale(1.05);
}

:deep(.p-card-body) {
  padding: 1.5rem;
}

:deep(.p-card-title) {
  margin-bottom: 0.75rem;
}

:deep(.p-card-subtitle) {
  margin-bottom: 1.25rem;
}

:deep(.p-card-content) {
  padding-top: 0;
}

.card-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-subtitle {
  font-size: 1.1rem;
  color: #1e4d2b;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(30, 77, 43, 0.1);
  border-radius: 20px;
  display: inline-block;
  border-left: 3px solid #1e4d2b;
}

.reservation-details {
  background: rgba(0, 0, 0, 0.02);
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.reservation-details p {
  font-size: 0.95rem;
  margin-bottom: 0.875rem;
  color: #495057;
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.reservation-details p:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.reservation-details strong {
  color: #2c3e50;
  font-weight: 600;
  min-width: 100px;
}

/* Status Styles */
.status-confirmada {
  color: #28a745;
  font-weight: 700;
  background: rgba(40, 167, 69, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pendiente {
  color: #ffc107;
  font-weight: 700;
  background: rgba(255, 193, 7, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-cancelada {
  color: #dc3545;
  font-weight: 700;
  background: rgba(220, 53, 69, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-completada {
  color: #007bff;
  font-weight: 700;
  background: rgba(0, 123, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .history-item-card {
    max-width: 100%;
    margin: 0 0 1.25rem;
  }
  
  .vehicle-image {
    height: 200px;
  }
  
  :deep(.p-card-body) {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .card-subtitle {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
  
  .reservation-details {
    padding: 1rem;
  }
  
  .reservation-details p {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    font-size: 0.9rem;
  }
  
  .reservation-details strong {
    min-width: auto;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .vehicle-image {
    height: 180px;
  }
  
  :deep(.p-card-body) {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
  
  .card-subtitle {
    font-size: 0.95rem;
    padding: 0.35rem 0.7rem;
  }
  
  .reservation-details {
    padding: 0.875rem;
  }
  
  .reservation-details p {
    font-size: 0.85rem;
  }
  
  .reservation-details strong {
    font-size: 0.8rem;
  }
}

@media (max-width: 360px) {
  .vehicle-image {
    height: 160px;
  }
  
  :deep(.p-card-body) {
    padding: 0.875rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .reservation-details {
    padding: 0.75rem;
  }
}
</style>