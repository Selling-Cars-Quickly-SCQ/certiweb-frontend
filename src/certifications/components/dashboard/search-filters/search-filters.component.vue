<script setup>
import { ref, computed, onMounted } from 'vue';
import brandPhrase from '@/assets/brandPhrase.png';
import { carService } from '@/certifications/services/car.service.js';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();

const carsData = ref([]);
const loading = ref(false);
const selectedBrand = ref(null);
const selectedModel = ref(null);

const brandOptions = computed(() => {
  const brands = [...new Set(carsData.value.map(car => car.brand))];
  const predefinedBrands = ['Toyota', 'Hyundai', 'Kia', 'Chevrolet', 'Suzuki', 'Mitsubishi', 'Honda', 'Volkswagen', 'Ford','Mercedes-Benz','BMW','Audi'];
  
  const allBrands = [...new Set([...predefinedBrands, ...brands])];
  
  return allBrands.map(brand => ({
    name: brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase(),
    code: brand.toUpperCase(),
    logo: getBrandIcon(brand)
  }));
});

const modelOptions = computed(() => {
  if (!selectedBrand.value) return [];
  
  const selectedBrandName = selectedBrand.value.toLowerCase();
  const models = carsData.value
    .filter(car => car.brand.toLowerCase() === selectedBrandName)
    .map(car => car.model)
    .filter((model, index, self) => self.indexOf(model) === index);
  
  return models.map(model => ({
    name: model,
    code: model.replace(/\s+/g, '_').toUpperCase(),
    category: getModelCategory(model)
  }));
});

const filteredModels = computed(() => {
  return modelOptions.value;
});

const isFormValid = computed(() => {
  return selectedBrand.value !== null;
});

const getBrandIcon = (brand) => {
  const iconMap = {
    'toyota': 'pi pi-circle-fill',
    'hyundai': 'pi pi-circle',
    'kia': 'pi pi-car',
    'chevrolet': 'pi pi-bolt',
    'suzuki': 'pi pi-circle-fill',
    'mitsubishi': 'pi pi-star',
    'honda': 'pi pi-circle',
    'volkswagen': 'pi pi-car',
    'ford': 'pi pi-circle-fill',
    'mercedes-benz': 'pi pi-car',
   'bmw': 'pi pi-car',
   'audi': 'pi pi-car'
  };
  return iconMap[brand.toLowerCase()] || 'pi pi-car';
};

const getModelCategory = (model) => {
  if (model.toLowerCase().includes('suv') || model.toLowerCase().includes('x')) {
    return 'SUV';
  } else if (model.toLowerCase().includes('sedan') || model.toLowerCase().includes('series')) {
    return 'Sedán';
  } else if (model.toLowerCase().includes('hatch')) {
    return 'Hatchback';
  }
  return 'Sedán';
};

const loadCarsData = async () => {
  try {
    loading.value = true;
    const cars = await carService.getAllCars();
    carsData.value = cars;
  } catch (error) {
    console.error('Error loading cars data:', error);
    carsData.value = [];
  } finally {
    loading.value = false;
  }
};

const search = () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  
  const queryParams = {};
  if (selectedBrand.value) {
    queryParams.brand = selectedBrand.value;
  }
  if (selectedModel.value) {
    queryParams.model = selectedModel.value; 
  }

  router.push({ path: '/cars', query: queryParams });

  loading.value = false;
};

const clearFilters = () => {
  selectedBrand.value = null;
  selectedModel.value = null;
};

const resetModelOnBrandChange = () => {
  selectedModel.value = null;
};

onMounted(async () => {
  await loadCarsData();
  document.querySelector('.search-container').classList.add('fade-in');
});
</script>

<template>
  <div class="search-page-container">
    <div class="brand-phrase-container">
      <img :src="brandPhrase" :alt="t('brandPhrase.alt')" class="brand-phrase-image" />
    </div>
    
    <div class="search-container">
      <div class="search-header">
        <i class="pi pi-search"></i>
        <h2>{{t('search-filters.title')}}</h2>
      </div>
      
      <div class="filter-section">
        <div class="filter-row">
          
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-tag"></i>
              <span>{{t('search-filters.brand')}}</span>
            </label>
            <select 
              v-model="selectedBrand" 
              class="filter-select"
              @change="resetModelOnBrandChange"
            >
              <option :value="null" disabled>{{t('search-filters.selectBrand')}}</option>
              <option 
                v-for="brand in brandOptions" 
                :key="brand.code" 
                :value="brand.name"
              >
                {{ brand.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-car"></i>
              <span>{{t('search-filters.model')}}</span>
            </label>
            <select 
              v-model="selectedModel" 
              class="filter-select"
              :disabled="!selectedBrand"
            >
              <option :value="null" disabled>{{t('search-filters.selectModel')}}</option>
              <option 
                v-for="model in filteredModels" 
                :key="model.code" 
                :value="model.name"
              >
                {{ model.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="button-container">
          <pv-button 
            type="button" 
            icon="pi pi-trash" 
            class="clear-button" 
            @click="clearFilters" 
            :label="t('search-filters.clear')" 
            outlined
          />
          
          <pv-button 
            type="button" 
            icon="pi pi-search" 
            class="search-button" 
            @click="search" 
            :loading="loading"
            :disabled="!isFormValid"
            :label="t('search-filters.search')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.search-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0.75rem;
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.brand-phrase-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.brand-phrase-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  width: 95%;
  max-height: 150px; 
  transition: transform 0.3s ease;
  filter: contrast(1.1) brightness(1.05);
}

.brand-phrase-image:hover {
  transform: scale(1.02);
}

.search-container {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.05),
    0 5px 10px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
}

.search-container:hover {
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.07),
    0 5px 15px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.search-header {
  background: linear-gradient(to right, #f1f5f9, #e2e8f0);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-header i {
  font-size: 1.25rem;
  color: #475569;
}

.search-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
}

.filter-section {
  padding: 1.5rem;
  background-color: white;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.filter-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.filter-label i {
  font-size: 0.95rem;
  color: #64748b;
}

.certificate-value, .brand-value, .model-value, .distance-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.certificate-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.certificate-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.certificate-option small {
  color: #64748b;
  font-size: 0.75rem;
  display: block;
  margin-top: 2px;
}

.brand-option, .model-option, .distance-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.model-category {
  font-size: 0.75rem;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

/* Buttons */
.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

:deep(.search-button) {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border: none;
  color: white;
  transition: all 0.3s ease;
  order: 1;
}

:deep(.search-button:hover) {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:deep(.clear-button) {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  color: #64748b;
  background: white;
  transition: all 0.3s ease;
  order: 2;
}

:deep(.clear-button:hover) {
  border-color: #cbd5e1;
  color: #475569;
  transform: translateY(-1px);
}

/* PrimeVue Select Styling  */
.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: #334155;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.filter-select option {
  color: #334155;
  background-color: white;
  padding: 0.5rem;
}

.filter-select:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Responsive Design */
@media (min-width: 480px) {
  .search-page-container {
    padding: 1.75rem 1rem;
  }
  
  .search-header {
    padding: 1.5rem 2rem;
  }
  
  .search-header i {
    font-size: 1.5rem;
  }
  
  .search-header h2 {
    font-size: 1.5rem;
  }
  
  .filter-section {
    padding: 1.75rem;
  }
  
  .brand-phrase-image {
    width: 85%;
    max-height: 160px;
  }
}

@media (min-width: 640px) {
  .filter-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .button-container {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  :deep(.search-button),
  :deep(.clear-button) {
    width: auto;
    min-width: 150px;
  }
  
  :deep(.search-button) {
    order: 2;
  }
  
  :deep(.clear-button) {
    order: 1;
  }
}
  
@media (min-width: 768px) {
  .search-page-container {
    padding: 2rem 1rem;
  }
  
  .brand-phrase-image {
    width: 80%;
    max-height: 180px;
  }
  
  .filter-section {
    padding: 2rem;
  }
  
  :deep(.search-button) {
    min-width: 180px;
    padding: 0.85rem 1.75rem;
    font-size: 1.05rem;
  }
  
  :deep(.clear-button) {
    min-width: 120px;
  }
}
  
@media (min-width: 1024px) {
  .search-page-container {
    padding: 2.5rem 1rem;
  }
  
  .filter-row {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
  
  :deep(.search-button) {
    min-width: 200px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .brand-phrase-image:hover,
  .search-container:hover,
  :deep(.search-button:hover),
  :deep(.clear-button:hover) {
    transform: none;
    transition: none;
  }
}

/* Focus styles for keyboard navigation */
.filter-select:focus-visible,
:deep(.search-button:focus-visible),
:deep(.clear-button:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .search-header {
    background: white;
    border-bottom: 2px solid black;
  }
  
  .search-header h2,
  .search-header i,
  .filter-label {
    color: black;
  }
  
  .filter-select {
    border: 2px solid black;
  }
  
  :deep(.search-button) {
    background: black;
    color: white;
  }
  
  :deep(.clear-button) {
    border: 2px solid black;
    color: black;
  }
}
</style>