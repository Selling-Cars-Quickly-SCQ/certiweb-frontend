<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { carService } from '../../../certifications/services/car.service';
  
  const cars = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const router = useRouter();
  const route = useRoute();
  
  const fetchCars = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const carsData = await carService.getAllCars();
      
      if (Array.isArray(carsData)) {
        const brandQuery = route.query.brand ? route.query.brand.toLowerCase() : null;
        const modelQuery = route.query.model ? route.query.model.toLowerCase() : null;

        if (brandQuery || modelQuery) {
          cars.value = carsData.filter(car => {
            const carBrand = car.brand ? car.brand.toLowerCase() : '';
            const carModel = car.model ? car.model.toLowerCase() : '';

            let matchesBrand = true;
            if (brandQuery) {
              matchesBrand = carBrand === brandQuery;
            }

            let matchesModel = true;
            if (modelQuery) {
              matchesModel = carModel === modelQuery;
            }
            return matchesBrand && matchesModel;
          });
          console.log('Cars filtered by query:', cars.value);
        } else {
          cars.value = carsData;
          console.log('All cars loaded:', carsData);
        }
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
      <h2 class="p-mb-4">Certified Cars</h2>
      <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="height: 200px;">
        <pv-progress-spinner />
      </div>
      <div v-else-if="error" class="p-error p-text-center">
        <p>Error loading cars: {{ error.message }}</p>
      </div>
      <div v-else-if="cars.length === 0" class="p-text-center">
        <p>No certified cars available at the moment.</p>
      </div>
      <div v-else class="car-grid">
        <pv-card v-for="car in cars" :key="car.id" class="car-card" @click="navigateToCarDetail(car.id)">
          <template #header>
            <img :src="getPhotoUrl(car)" :alt="car.model" class="car-image" />
          </template>
          <template #title>
            <div class="car-title">{{ car.title }}</div>
          </template>
          <template #subtitle>
            <div class="car-brand-model">{{ car.brand }} - {{ car.model }}</div>
            <div class="car-year">Year: {{ car.year }}</div>
          </template>
          <template #content>
            <p class="car-description">{{ car.description ? car.description.substring(0, 100) + '...' : 'No description available' }}</p>
            <div class="car-owner">Owner: {{ car.owner }}</div>
          </template>
          <template #footer>
            <div class="car-price">{{ formatCurrency(car.price) }}</div>
            <pv-button label="View Details" icon="pi pi-search" class="p-button-sm" />
          </template>
        </pv-card>
      </div>
    </div>
</template>

<style scoped>
.car-list-container {
  padding: 2rem;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
}

.car-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background-color: #eaeaea;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.car-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.car-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.car-brand-model {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.25rem;
}

.car-year {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
}

.car-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  min-height: 40px;
}

.car-owner {
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
  margin-bottom: 1rem;
}

.car-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
}

:deep(.p-card-body) {
  padding: 1rem;
}

:deep(.p-card-title) {
  font-size: 1.2rem;
}

:deep(.p-card-subtitle) {
  margin-bottom: 0.5rem;
}

:deep(.p-card-content) {
  padding-top: 0;
  padding-bottom: 0.5rem;
}

:deep(.p-card-footer) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
}
</style>