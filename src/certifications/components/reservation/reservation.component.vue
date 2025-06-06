<script setup>
import { ref } from 'vue';
import vehicleSpecComponent from './vehicle-spec/vehicle-spec.component.vue';
import calendarComponent from './calendar/calendar.component.vue';
import toolbarComponent from '../../../certifications/components/dashboard/toolbar/toolbar.component.vue';

const vehicleDataFromSpec = ref({});
const selectedDateTime = ref(null);

const handleVehicleDataUpdate = (data) => {
  vehicleDataFromSpec.value = data;
};

</script>

<template>
  <toolbarComponent/>
    <vehicleSpecComponent @update:vehicleData="handleVehicleDataUpdate"/>
    <calendarComponent 
      :modelValue="selectedDateTime" 
      @update:modelValue="selectedDateTime = $event"
      :vehicleData="vehicleDataFromSpec" 
    />
</template>

<style scoped>

</style>