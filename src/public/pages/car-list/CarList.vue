<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { carService } from '../../../certifications/services/car.service';
import toolbarComponent from '../../../certifications/components/dashboard/toolbar/toolbar.component.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const cars = ref([]);
const loading = ref(true);
const error = ref(null);
  
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
  console.log('Navigating to car detail with ID:', carId, typeof carId);
  
  const id = String(carId);
  
  if (!id || id === 'undefined' || id === 'null') {
    console.error('Invalid car ID for navigation:', carId);
    return;
  }
  
  router.push(`/car-detail/${id}`);
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
  <toolbarComponent/>
  <div class="car-list-container p-d-flex p-flex-column p-ai-center">
    <h2 class="p-mb-4">{{ t('carList.title') }}</h2>
    <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="height: 200px;">
      <pv-progress-spinner />
      <span class="p-ml-2">{{ t('carList.loading') }}</span>
    </div>
    <div v-else-if="error" class="p-error p-text-center">
      <p>{{ t('carList.error') }} {{ error.message }}</p>
    </div>
    <div v-else-if="cars.length === 0" class="p-text-center">
      <p>{{ t('carList.empty') }}</p>
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
          <div class="car-year">{{ t('carList.year') }} {{ car.year }}</div>
        </template>
        <template #content>
          <p class="car-description">{{ car.description ? car.description.substring(0, 100) + '...' : t('carList.noDescription') }}</p>
          <div class="car-owner">{{ t('carList.owner') }} {{ car.owner }}</div>
        </template>
        <template #footer>
          <div class="car-price">{{ formatCurrency(car.price) }}</div>
          <pv-button :label="t('carList.viewDetails')" icon="pi pi-search" class="p-button-sm" />
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.car-list-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  min-height: calc(100vh - 70px);
}

.car-list-container h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.car-list-container h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 2px;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 1rem 0;
}

.car-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.car-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.car-card:hover::before {
  transform: scaleX(1);
}

.car-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image {
  transform: scale(1.05);
}

.car-title {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.car-brand-model {
  font-size: 1.1rem;
  color: #007bff;
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.car-brand-model::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #007bff, #0056b3);
  border-radius: 2px;
}

.car-year {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
  font-weight: 500;
  background: rgba(108, 117, 125, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
}

.car-description {
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 1rem;
  min-height: 60px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.car-owner {
  font-size: 0.875rem;
  color: #6c757d;
  font-style: italic;
  margin-bottom: 1.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(108, 117, 125, 0.05);
  border-radius: 8px;
  border-left: 3px solid #007bff;
}

.car-price {
  font-size: 1.375rem;
  font-weight: 800;
  color: #28a745;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

/* Loading and Error States */
.car-list-container .p-d-flex {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
}

.car-list-container .p-error {
  background: #f8d7da;
  color: #721c24;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  margin: 2rem 0;
}

.car-list-container .p-text-center {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
  font-size: 1.2rem;
  color: #6c757d;
}

/* PrimeVue Card Customization */
:deep(.p-card-body) {
  padding: 1.5rem;
}

:deep(.p-card-title) {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

:deep(.p-card-subtitle) {
  margin-bottom: 1rem;
}

:deep(.p-card-content) {
  padding-top: 0;
  padding-bottom: 1rem;
}

:deep(.p-card-footer) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
  gap: 1rem;
}

:deep(.p-button-sm) {
  padding: 0.625rem 1.25rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border-radius: 20px !important;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

:deep(.p-button-sm:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .car-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .car-list-container {
    padding: 1.5rem;
  }
  
  .car-list-container h2 {
    font-size: 2.25rem;
    margin-bottom: 2.5rem;
  }
}

@media (max-width: 992px) {
  .car-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .car-list-container h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .car-image {
    height: 220px;
  }
  
  .car-title {
    font-size: 1.25rem;
  }
  
  .car-price {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .car-list-container {
    padding: 1rem;
  }
  
  .car-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  
  .car-list-container h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
  
  .car-list-container h2::after {
    width: 80px;
    height: 3px;
  }
  
  .car-image {
    height: 200px;
  }
  
  .car-title {
    font-size: 1.125rem;
  }
  
  .car-brand-model {
    font-size: 1rem;
  }
  
  .car-description {
    font-size: 0.9rem;
    min-height: 50px;
  }
  
  .car-price {
    font-size: 1.125rem;
    padding: 0.4rem 0.8rem;
  }
  
  :deep(.p-card-body) {
    padding: 1.25rem;
  }
  
  :deep(.p-card-footer) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  :deep(.p-button-sm) {
    width: 100% !important;
    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  .car-list-container {
    padding: 0.75rem;
  }
  
  .car-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .car-list-container h2 {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
  
  .car-list-container h2::after {
    width: 60px;
    height: 2px;
  }
  
  .car-image {
    height: 180px;
  }
  
  .car-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .car-brand-model {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }
  
  .car-year {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .car-description {
    font-size: 0.875rem;
    min-height: 45px;
    margin-bottom: 0.75rem;
  }
  
  .car-owner {
    font-size: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.4rem 0.6rem;
  }
  
  .car-price {
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
  }
  
  :deep(.p-card-body) {
    padding: 1rem;
  }
  
  :deep(.p-card-footer) {
    padding: 1rem;
    padding-top: 0;
  }
  
  :deep(.p-button-sm) {
    padding: 0.5rem 1rem !important;
    font-size: 0.8rem !important;
  }
}

@media (max-width: 360px) {
  .car-list-container {
    padding: 0.5rem;
  }
  
  .car-list-container h2 {
    font-size: 1.375rem;
  }
  
  .car-image {
    height: 160px;
  }
  
  .car-title {
    font-size: 0.95rem;
  }
  
  .car-brand-model {
    font-size: 0.9rem;
  }
  
  .car-description {
    font-size: 0.8rem;
  }
  
  .car-price {
    font-size: 0.95rem;
  }
  
  :deep(.p-card-body) {
    padding: 0.875rem;
  }
}
</style>