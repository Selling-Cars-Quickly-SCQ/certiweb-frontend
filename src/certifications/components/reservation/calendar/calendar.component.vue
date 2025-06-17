<script setup>
import { ref, watch, onMounted } from 'vue';
import { reservationService } from '@/certifications/services/reservation.service.js';
import { userService } from '@/certifications/services/user.service.js';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const router = useRouter();
const { t } = useI18n();

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
    if (!event || (!event.value && !event)) {
      console.error("Error: Evento de selección de fecha sin valor válido");
      return;
    }
    
    const dateValue = event.value || event;
    const selectedDate = new Date(dateValue);
    
    if (isNaN(selectedDate.getTime())) {
      throw new Error("Fecha inválida seleccionada");
    }
    
    let hour = 9;
    let minutes = 0;
    
    if (fechaHora.value instanceof Date && !isNaN(fechaHora.value.getTime())) {
      const currentHour = fechaHora.value.getHours();
      
      if ([9, 11, 13, 15, 17].includes(currentHour)) {
        hour = currentHour;
      }
      minutes = 0;
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
  if (!fechaHora.value || !(fechaHora.value instanceof Date) || isNaN(fechaHora.value.getTime())) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (dayOfWeek === 0) {
      today.setDate(today.getDate() + 1);
    } else if (dayOfWeek === 6) {
      today.setDate(today.getDate() + 2); 
    }
    
    today.setHours(horario.hour, 0, 0, 0);
    fechaHora.value = today;
    
    toast.add({ 
      severity: 'info', 
      summary: 'Información', 
      detail: 'Se ha seleccionado la fecha actual con el horario elegido.', 
      life: 3000 
    });
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

  const selectedHour = fechaHora.value.getHours();
  const selectedMinutes = fechaHora.value.getMinutes();
  const selectedSeconds = fechaHora.value.getSeconds();
  
  const validHours = [9, 11, 13, 15, 17];
  if (!validHours.includes(selectedHour) || selectedMinutes !== 0 || selectedSeconds !== 0) {
    toast.add({ 
      severity: 'warn', 
      summary: 'Advertencia', 
      detail: 'Por favor, seleccione una hora válida: 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM o 5:00 PM.', 
      life: 3000 
    });
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
    
    const year = fechaHora.value.getFullYear();
    const month = fechaHora.value.getMonth();
    const day = fechaHora.value.getDate();
    const hour = fechaHora.value.getHours();
    
    const inspectionDate = new Date(Date.UTC(year, month, day, hour, 0, 0, 0));
    
    const reservationPayload = {
      userId: currentUser.id,
      reservationName: currentUser.name,
      reservationEmail: currentUser.email,
      imageUrl: props.vehicleData.imagenes[0].url,
      brand: props.vehicleData.marca,
      model: props.vehicleData.modelo,
      licensePlate: props.vehicleData.placa,
      inspectionDateTime: inspectionDate.toISOString(),
      price: props.vehicleData.precioVender,
      status: 'pending'
    };

    console.log('Fecha original seleccionada:', fechaHora.value);
    console.log('Hora local seleccionada:', selectedHour);
    console.log('Fecha UTC creada:', inspectionDate);
    console.log('Hora UTC en la fecha:', inspectionDate.getUTCHours());
    console.log('ISO String enviado:', inspectionDate.toISOString());

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
    <h2 class="subtitulo-formulario">{{ t('calendar.title') }}</h2>
    
    <div class="calendar-layout">
      <div class="calendar-section">
        <h3 class="calendar-subtitle">{{ t('calendar.selectDate') }}</h3>
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
        <small class="calendar-note">{{ t('calendar.weekdaysNote') }}</small>
      </div>
      
      <!-- Time -->
      <div class="time-section">
        <h3 class="calendar-subtitle">{{ t('calendar.selectTime') }}</h3>
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
        <small class="calendar-note">{{ t('calendar.timeSlotsNote') }}</small>
      </div>
    </div>
    
    <div class="selected-datetime" v-if="fechaHora && fechaHora instanceof Date && !isNaN(fechaHora.getTime())">
      <h3 class="calendar-subtitle">{{ t('calendar.selectedDateTime') }}</h3>
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
    
    <div class="confirm-reservation-section">
      <pv-button 
        :label="t('calendar.confirmButton')" 
        icon="pi pi-check" 
        class="p-button-success confirm-button" 
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.subtitulo-formulario {
  color: #1e4d2b;
  font-size: 1.75rem;
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: center;
  position: relative;
  padding-bottom: 0.75rem;
}

.subtitulo-formulario::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

.calendar-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.calendar-section,
.time-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(30, 77, 43, 0.1);
  transition: all 0.3s ease;
}

.calendar-section:hover,
.time-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.calendar-subtitle {
  font-size: 1.25rem;
  color: #1e4d2b;
  margin-bottom: 1.25rem;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.calendar-subtitle::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

.calendar-note {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem;
  background: rgba(30, 77, 43, 0.05);
  border-radius: 6px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.time-slot {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.time-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.time-slot:hover {
  background: linear-gradient(135deg, #e6f7e6 0%, #d4edda 100%);
  border-color: #1e4d2b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.2);
}

.time-slot:hover::before {
  left: 100%;
}

.time-slot.selected {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  color: white;
  border-color: #1e4d2b;
  box-shadow: 0 4px 15px rgba(30, 77, 43, 0.3);
  transform: scale(1.05);
}

.selected-datetime {
  margin-top: 2rem;
  background: linear-gradient(135deg, #e6f7e6 0%, #d4edda 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(30, 77, 43, 0.2);
  box-shadow: 0 2px 10px rgba(30, 77, 43, 0.1);
}

.datetime-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  flex-wrap: wrap;
}

.datetime-preview i {
  color: #1e4d2b;
  font-size: 1.25rem;
}

.confirm-reservation-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(30, 77, 43, 0.1);
}

:deep(.confirm-button) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  border: none !important;
  padding: 0.875rem 2.5rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 25px !important;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3) !important;
  transition: all 0.3s ease !important;
}

:deep(.confirm-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4) !important;
}

:deep(.confirm-button:disabled) {
  background: #6c757d !important;
  box-shadow: none !important;
  transform: none !important;
}

/* PrimeVue DatePicker Customization */
:deep(.p-datepicker) {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(30, 77, 43, 0.1);
}

:deep(.p-datepicker table) {
  font-size: 0.95rem;
  border-collapse: collapse;
  width: 100%;
}

:deep(.p-datepicker-header) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  color: white;
  text-align: center;
  padding: 1rem;
  font-weight: 600;
}

:deep(.p-datepicker-calendar td) {
  padding: 0.75rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 2px;
}

:deep(.p-highlight) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%) !important;
  color: white !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
}

:deep(.p-datepicker-today > span) {
  border: 2px solid #1e4d2b !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
}

:deep(.p-datepicker-calendar td:not(.p-disabled):hover) {
  background: linear-gradient(135deg, #e6f7e6 0%, #d4edda 100%) !important;
  border-radius: 6px !important;
  transform: scale(1.05);
}

:deep(.p-datepicker-calendar td.p-disabled) {
  background-color: #f8f9fa;
  color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.5;
}

:deep(.p-datepicker-prev),
:deep(.p-datepicker-next) {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 50% !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  transition: all 0.2s ease !important;
}

:deep(.p-datepicker-prev:hover),
:deep(.p-datepicker-next:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.1) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .calendar-container {
    padding: 1.25rem;
  }
  
  .calendar-layout {
    gap: 1.5rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.5rem;
  }
  
  .time-slots {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
  }
  
  .time-slot {
    padding: 0.875rem 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .calendar-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.375rem;
    margin-bottom: 1.5rem;
  }
  
  .calendar-section,
  .time-section {
    padding: 1.25rem;
  }
  
  .calendar-subtitle {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .time-slots {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .time-slot {
    padding: 1rem 0.75rem;
    font-size: 0.95rem;
  }
  
  .datetime-preview {
    font-size: 1rem;
    gap: 0.5rem;
    text-align: center;
  }
  
  .datetime-preview span {
    display: block;
    width: 100%;
    margin: 0.25rem 0;
  }
  
  :deep(.confirm-button) {
    width: 100% !important;
    max-width: 300px !important;
    padding: 1rem 2rem !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .calendar-container {
    padding: 0.75rem;
    margin: 0.25rem;
    border-radius: 12px;
  }
  
  .subtitulo-formulario {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }
  
  .calendar-section,
  .time-section {
    padding: 1rem;
  }
  
  .calendar-subtitle {
    font-size: 1rem;
    margin-bottom: 0.875rem;
  }
  
  .time-slots {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .time-slot {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
  
  .calendar-note {
    font-size: 0.8rem;
    padding: 0.375rem;
  }
  
  .selected-datetime {
    padding: 1rem;
  }
  
  .datetime-preview {
    font-size: 0.9rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .datetime-preview i {
    font-size: 1.1rem;
  }
  
  :deep(.p-datepicker-calendar td) {
    padding: 0.5rem;
  }
  
  :deep(.p-datepicker table) {
    font-size: 0.875rem;
  }
}

@media (max-width: 360px) {
  .calendar-container {
    padding: 0.5rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.125rem;
  }
  
  .calendar-section,
  .time-section {
    padding: 0.75rem;
  }
  
  .time-slot {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
  
  :deep(.confirm-button) {
    padding: 0.875rem 1.5rem !important;
    font-size: 0.95rem !important;
  }
}
</style>