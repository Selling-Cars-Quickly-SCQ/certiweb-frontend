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
      <img :src="brandPhrase" alt="Brand Phrase" class="brand-phrase-image" />
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
              <option :value="null" disabled>Selecciona marca</option>
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
              <option :value="null" disabled>Selecciona modelo</option>
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
  padding: 2rem 1rem;
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
  margin-bottom: 2.5rem;
}

.brand-phrase-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  width: 80%;
  max-height: 180px; 
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
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-header i {
  font-size: 1.5rem;
  color: #475569;
}

.search-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
}

.filter-section {
  padding: 2rem;
  background-color: white;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
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
}

.filter-label i {
  font-size: 1rem;
  color: #64748b;
}

.certificate-value, .brand-value, .model-value, .distance-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.certificate-dot {
  width: 10px;
  height: 10px;
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
  font-size: 0.8rem;
  display: block;
  margin-top: 2px;
}

.brand-option, .model-option, .distance-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.model-category {
  font-size: 0.8rem;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

/* Buttons */
.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

:deep(.search-button) {
  min-width: 200px;
  padding: 0.85rem 1.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

:deep(.search-button:hover) {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:deep(.clear-button) {
  min-width: 120px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  color: #64748b;
  background: white;
  transition: all 0.3s ease;
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
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;
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
}

.filter-select:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-page-container {
    padding: 1rem 0.5rem;
  }
  
  .brand-phrase-image {
    width: 90%;
    max-height: 140px;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .button-container {
    flex-direction: column;
    align-items: center;
  }
  
  :deep(.search-button),
  :deep(.clear-button) {
    width: 100%;
    max-width: 300px;
  }
}
</style>