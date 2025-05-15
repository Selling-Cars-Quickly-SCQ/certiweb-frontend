<script setup>
import { defineProps } from 'vue';
import { Reservation } from '@/certifications/model/reservation.entity.js';

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

const placeholderImage = 'https://via.placeholder.com/300x200.png?text=Vehiculo';
const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

</script>

<template>
  <pv-card class="history-item-card">
    <template #header>
      <img
        :src="reservation.imageUrl || placeholderImage"
        alt="Imagen del vehículo"
        class="vehicle-image"
        @error="handleImageError"
      />
    </template>
    <template #title>
      <div class="card-title">{{ reservation.reservationName || 'Nombre no disponible' }}</div>
    </template>
    <template #subtitle>
      <div class="card-subtitle">{{ reservation.brand }} - {{ reservation.model }}</div>
    </template>
    <template #content>
      <div class="reservation-details">
        <p><strong>Fecha y Hora:</strong> {{ formatDateTime(reservation.inspectionDateTime) }}</p>
        <p><strong>Precio:</strong> S/ {{ reservation.price || 'No especificado' }}</p>
        <p><strong>Estado:</strong> <span :class="`status-${reservation.status?.toLowerCase()}`">{{ reservation.status || 'No especificado' }}</span></p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.history-item-card {
  width: 350px;
  margin: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.history-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.vehicle-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.reservation-details p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.reservation-details strong {
  color: #333;
}

.status-confirmada {
  color: green;
  font-weight: bold;
}
.status-pendiente {
  color: orange;
  font-weight: bold;
}
.status-cancelada {
  color: red;
  font-weight: bold;
}
.status-completada {
  color: blue;
  font-weight: bold;
}
</style>