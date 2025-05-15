<script setup>
import { ref, watch, onMounted } from 'vue';
import { reservationService } from '@/certifications/services/reservation.service.js';
import { userService } from '@/certifications/services/user.service.js';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  vehicleData: {
    type: Object,
    default: () => ({
      placa: '',
      marca: '',
      modelo: '',
      imagenes: [],
      precioVender: 0
    })
  }
});

const emit = defineEmits(['update:modelValue']);


const fechaHora = ref(props.modelValue || null);

const horariosDisponibles = [
  { display: '9:00 AM', hour: 9 },
  { display: '11:00 AM', hour: 11 },
  { display: '1:00 PM', hour: 13 },
  { display: '3:00 PM', hour: 15 },
  { display: '5:00 PM', hour: 17 }
];


onMounted(() => {
  if (!fechaHora.value) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (dayOfWeek === 0) {
      today.setDate(today.getDate() + 1); 
    } else if (dayOfWeek === 6) {
      today.setDate(today.getDate() + 2);
    }
    
    today.setHours(9, 0, 0, 0);

  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue instanceof Date && !isNaN(newValue.getTime())) {
    fechaHora.value = newValue;
  }
});

watch(fechaHora, (newValue) => {
  if (newValue instanceof Date && !isNaN(newValue.getTime())) {
    emit('update:modelValue', newValue);
  }
});

const handleDateSelect = (event) => {
  try {
    if (!event || !event.value) {
      console.error("Error: Evento de selección de fecha sin valor válido");
      return;
    }
    
    const selectedDate = new Date(event.value);
    if (isNaN(selectedDate.getTime())) {
      throw new Error("Fecha inválida seleccionada");
    }
    
    let hour = 9;
    let minutes = 0;
    
    if (fechaHora.value instanceof Date && !isNaN(fechaHora.value.getTime())) {
      hour = fechaHora.value.getHours();
      minutes = fechaHora.value.getMinutes();
    }
    
    selectedDate.setHours(hour, minutes, 0, 0);
    
    fechaHora.value = selectedDate;
  } catch (error) {
    console.error("Error al procesar la fecha seleccionada:", error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al seleccionar la fecha. Por favor, intente nuevamente.', 
      life: 3000 
    });
  }
};

const selectTimeSlot = (horario) => {
  if (!fechaHora.value || !(fechaHora.value instanceof Date) || isNaN(fechaHora.value)) {
    const today = new Date();
    if (today.getDay() === 0 || today.getDay() === 6) {
      toast.add({ severity: 'info', summary: 'Información', detail: 'Por favor, seleccione primero una fecha válida (Lunes a Viernes).', life: 3000 });
      return;
    }
    
    const newDate = new Date(today);
    newDate.setHours(horario.hour, 0, 0, 0);
    fechaHora.value = newDate;
  } else {
    try {
      const newDate = new Date(fechaHora.value);
      newDate.setHours(horario.hour, 0, 0, 0);
      fechaHora.value = newDate;
    } catch (error) {
      console.error("Error al seleccionar la hora:", error);
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al seleccionar la hora. Por favor, intente nuevamente.', 
        life: 3000 
      });
    }
  }
};

const handleConfirmReservation = async () => {
  if (!fechaHora.value || !(fechaHora.value instanceof Date) || isNaN(fechaHora.value.getTime())) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione una fecha y hora válida para la inspección.', life: 3000 });
    return;
  }

  const selectedHourComponent = fechaHora.value.getHours();
  const isSpecificTimeSelected = horariosDisponibles.some(h => h.hour === selectedHourComponent);
  if (!isSpecificTimeSelected || fechaHora.value.getMinutes() !== 0) {
     toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione una hora válida de la lista.', life: 3000 });
     return;
  }

  if (!props.vehicleData || !props.vehicleData.placa || !props.vehicleData.marca || !props.vehicleData.modelo) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Faltan datos del vehículo (placa, marca, modelo).', life: 3000 });
    return;
  }

  if (!props.vehicleData.imagenes || props.vehicleData.imagenes.length === 0 || !props.vehicleData.imagenes[0].url) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, suba al menos la primera imagen del vehículo.', life: 3000 });
    return;
  }

  if (props.vehicleData.precioVender === null || props.vehicleData.precioVender === undefined || props.vehicleData.precioVender <= 0) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese un precio válido para el vehículo.', life: 3000 });
    return;
  }

  try {
    const currentUser = await userService.getCurrentUser();
    const reservationPayload = {
      userId: currentUser.id,
      reservationName: currentUser.name,
      imageUrl: props.vehicleData.imagenes[0].url,
      brand: props.vehicleData.marca,
      model: props.vehicleData.modelo,
      licensePlate: props.vehicleData.placa,
      inspectionDateTime: fechaHora.value.toISOString(),
      price: props.vehicleData.precioVender,
      status: 'pending'
    };

    await reservationService.createReservation(reservationPayload);
    toast.add({ severity: 'success', summary: 'Reserva Confirmada', detail: 'Su inspección ha sido reservada exitosamente. Redirigiendo...', life: 3500 });
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error de Reserva', detail: 'No se pudo crear la reserva. Intente nuevamente.', life: 3500 });
    console.error("Error al confirmar reserva:", error);
  }
};
</script>

<template>
  <div class="calendar-container">
    <h2 class="subtitulo-formulario">RESERVE LA HORA DE INSPECCIÓN</h2>
    
    <div class="calendar-layout">
      <div class="calendar-section">
        <h3 class="calendar-subtitle">Seleccione una fecha</h3>
      <pv-datePicker 
          v-model="fechaHora" 
          :inline="true"
          :showTime="false"
          :minDate="new Date()"
          :disabledDays="[0, 6]"
          dateFormat="dd/mm/yy"
          selectionMode="single"
          @date-select="handleDateSelect"
        />
        <small class="calendar-note">Solo días laborables (Lunes a Viernes)</small>
      </div>
      
      <!-- Time -->
      <div class="time-section">
        <h3 class="calendar-subtitle">Seleccione una hora</h3>
        <div class="time-slots">
          <div 
            v-for="(horario, index) in horariosDisponibles" 
            :key="index"
            class="time-slot"
            :class="{ 
              'selected': fechaHora && fechaHora instanceof Date && !isNaN(fechaHora) && fechaHora.getHours() === horario.hour && fechaHora.getMinutes() === 0
            }"
            @click="selectTimeSlot(horario)"
          >
            {{ horario.display }}
          </div>
        </div>
        <small class="calendar-note">Horarios disponibles de Lunes a Viernes</small>
      </div>
    </div>
    
    <div class="selected-datetime" v-if="fechaHora && fechaHora instanceof Date && !isNaN(fechaHora.getTime())">
      <h3 class="calendar-subtitle">Fecha y hora seleccionada:</h3>
      <div class="datetime-preview">
        <i class="pi pi-calendar"></i>
        <span>{{ fechaHora.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) }}</span>
        <i class="pi pi-clock" style="margin-left: 15px;"></i>
        <span>{{ fechaHora.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit'
        }) }}</span>
      </div>
    </div>
    
    <div class="confirm-reservation-section" style="text-align: center; margin-top: 20px;">
      <pv-button 
        label="Confirmar Reserva" 
        icon="pi pi-check" 
        class="p-button-success" 
        @click="handleConfirmReservation"
        :disabled="!fechaHora || !vehicleData.placa" 
      />
    </div>
    <pv-toast />
  </div>
</template>

<style scoped>
.calendar-container {
  width: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subtitulo-formulario {
  color: #1e4d2b;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
}

.calendar-layout {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.calendar-section,
.time-section {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.calendar-subtitle {
  font-size: 18px;
  color: #1e4d2b;
  margin-bottom: 15px;
  text-align: center;
}

.calendar-note {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 12px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.time-slot {
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.time-slot:hover {
  background-color: #e6f7e6;
  border-color: #1e4d2b;
}

.time-slot.selected {
  background-color: #1e4d2b;
  color: white;
  border-color: #1e4d2b;
}

.selected-datetime {
  margin-top: 20px;
  background-color: #e6f7e6;
  border-radius: 8px;
  padding: 15px;
}

.datetime-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 16px;
}

.datetime-preview i {
  color: #1e4d2b;
  font-size: 18px;
}

:deep(.p-datepicker) {
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

:deep(.p-datepicker table) {
  font-size: 14px;
  border-collapse: collapse;
}

:deep(.p-datepicker-header) {
  background-color: #1e4d2b;
  color: white;
  text-align: center;
}

:deep(.p-datepicker-calendar td) {
  padding: 10px;
  cursor: pointer;
}

:deep(.p-highlight) {
  background-color: #1e4d2b !important;
  color: white !important;
}

:deep(.p-datepicker-today > span) {
  border-color: #1e4d2b !important;
}

:deep(.p-datepicker-calendar td:not(.p-disabled):hover) {
  background-color: #e6f7e6 !important;
}


:deep(.p-datepicker-calendar td.p-datepicker-current-day) {
  background-color: #1e4d2b !important;
}

:deep(.p-datepicker-calendar td.p-disabled) {
  background-color: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-layout {
    flex-direction: column;
  }

  .time-slots {
    grid-template-columns: 1fr;
  }
}
</style>