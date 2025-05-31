<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { carService } from '../../../certifications/services/car.service';
  
  const cars = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const router = useRouter();
  
  const fetchCars = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const carsData = await carService.getAllCars();
      
      if (Array.isArray(carsData)) {
        cars.value = carsData;
        console.log('Cars loaded:', carsData);
      } else {
        console.warn('Fetched data is not an array:', carsData);
        cars.value = [];
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      error.value = err;
      cars.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const navigateToCarDetail = (carId) => {
    router.push(`/cars/${carId}`);
  };
  
  const getPhotoUrl = (car) => {
    return car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  };
  
  const formatCurrency = (value) => {
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numValue !== 'number' || isNaN(numValue)) {
      return value;
    }
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(numValue);
  };
  
  onMounted(() => {
    fetchCars();
  });
</script>

<template>
    <div class="car-list-container p-d-flex p-flex-column p-ai-center">
      <h2 class="p-mb-4">Autos Certificados</h2>
      <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="height: 200px;">
        <pv-progress-spinner />
      </div>
      <div v-else-if="error" class="p-error p-text-center">
        <p>Error al cargar los autos: {{ error.message }}</p>
      </div>
      <div v-else-if="cars.length === 0" class="p-text-center">
        <p>No hay autos certificados disponibles en este momento.</p>
      </div>
      <div v-else class="p-grid p-justify-center">
        <div v-for="car in cars" :key="car.id" class="p-col-12 p-md-6 p-lg-4 p-xl-3">
          <pv-card class="car-card p-mb-3" @click="navigateToCarDetail(car.id)" style="cursor: pointer;">
            <template #header>
              <img :alt="car.marca + ' ' + car.modelo" :src="getPhotoUrl(car)" class="car-image" />
            </template>
            <template #title>
              {{ car.marca }} {{ car.modelo }}
            </template>
            <template #subtitle>
              Año: {{ car.ano }}
            </template>
            <template #content>
              <p><strong>Precio:</strong> {{ formatCurrency(car.price) }}</p>
              <p><strong>Propietario:</strong> {{ car.propietario }}</p>
            </template>
          </pv-card>
        </div>
      </div>
    </div>
</template>
  
<style scoped>
.car-list-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.car-list-container h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.car-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.car-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.car-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image {
  transform: scale(1.05);
}

.car-card .p-card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.car-card .p-card-subtitle {
  color: #7f8c8d;
  font-weight: 500;
  margin-bottom: 1rem;
}

.car-card .p-card-content p {
  margin: 0.5rem 0;
  color: #34495e;
  font-size: 0.95rem;
}

.car-card .p-card-content strong {
  color: #2c3e50;
  font-weight: 600;
}

/* Grid improvements */
.p-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.p-col-12, .p-col-md-6, .p-col-lg-4, .p-col-xl-3 {
  padding: 0;
}

/* Loading and error states */
.p-error {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  padding: 2rem;
  color: #c33;
  font-weight: 500;
}
</style>