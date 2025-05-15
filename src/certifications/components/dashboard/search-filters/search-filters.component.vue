<script setup>
import { ref, computed, onMounted } from 'vue';
import brandPhrase from '@/assets/brandPhrase.png';

const certificateOptions = ref([
  { name: 'Certificado Premium', code: 'CP1', color: '#4ade80', description: 'Garantía extendida y revisión completa' },
  { name: 'Certificado Estándar', code: 'CE1', color: '#60a5fa', description: 'Revisión básica certificada' },
  { name: 'Sin Certificado', code: 'SC1', color: '#94a3b8', description: 'Sin revisión certificada' }
]);

const brandOptions = ref([
  { name: 'BMW', code: 'BMW', logo: 'pi pi-circle-fill' },
  { name: 'Mercedes', code: 'MER', logo: 'pi pi-star-fill' },
  { name: 'Audi', code: 'AUD', logo: 'pi pi-circle' },
  { name: 'Toyota', code: 'TOY', logo: 'pi pi-car' }
]);

const modelOptions = ref([
  { name: 'Serie 3', code: 'S3', category: 'Sedán' },
  { name: 'Serie 5', code: 'S5', category: 'Sedán' },
  { name: 'X5', code: 'X5', category: 'SUV' },
  { name: 'X3', code: 'X3', category: 'SUV' }
]);

const distanceOptions = ref([
  { name: '10 km', code: '10', value: 10 },
  { name: '25 km', code: '25', value: 25 },
  { name: '50 km', code: '50', value: 50 },
  { name: '100 km', code: '100', value: 100 }
]);

const selectedCertificate = ref(null);
const selectedBrand = ref(null);
const selectedModel = ref(null);
const selectedDistance = ref(null);


const filteredModels = computed(() => {
  if (!selectedBrand.value) return modelOptions.value;
  
  if (selectedBrand.value.code === 'BMW') {
    return modelOptions.value.filter(model => model.code === 'S3' || model.code === 'S5' || model.code === 'X3');
  } else if (selectedBrand.value.code === 'MER') {
    return modelOptions.value.filter(model => model.code === 'X5' || model.code === 'X3');
  }
  return modelOptions.value;
});

const loading = ref(false);

const isFormValid = computed(() => {
  return selectedBrand.value !== null;
});


const search = () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  
  setTimeout(() => {
    loading.value = false;
    console.log('Búsqueda realizada con:', {
      certificado: selectedCertificate.value,
      marca: selectedBrand.value,
      modelo: selectedModel.value,
      distancia: selectedDistance.value,
    });
  }, 1500);
};

const clearFilters = () => {
  selectedCertificate.value = null;
  selectedBrand.value = null;
  selectedModel.value = null;
  selectedDistance.value = null;
};

onMounted(() => {
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
        <h2>Encuentra tu vehículo ideal</h2>
      </div>
      
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-certificate"></i>
              <span>Certificado</span>
            </label>
            <pv-select 
              v-model="selectedCertificate" 
              :options="certificateOptions" 
              optionLabel="name" 
              placeholder="Selecciona certificado" 
              class="filter-select"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="certificate-value">
                  <span class="certificate-dot" :style="{ backgroundColor: slotProps.value.color }"></span>
                  <span>{{ slotProps.value.name }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              
              <template #option="slotProps">
                <div class="certificate-option">
                  <span class="certificate-dot" :style="{ backgroundColor: slotProps.option.color }"></span>
                  <div>
                    <div>{{ slotProps.option.name }}</div>
                    <small>{{ slotProps.option.description }}</small>
                  </div>
                </div>
              </template>
              
              <template #indicator>
                <i class="pi pi-chevron-down"></i>
              </template>
            </pv-select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-tag"></i>
              <span>Marca</span>
            </label>
            <pv-select 
              v-model="selectedBrand" 
              :options="brandOptions" 
              optionLabel="name" 
              placeholder="Selecciona marca" 
              class="filter-select"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="brand-value">
                  <i :class="slotProps.value.logo"></i>
                  <span>{{ slotProps.value.name }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              
              <template #option="slotProps">
                <div class="brand-option">
                  <i :class="slotProps.option.logo"></i>
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
              
              <template #indicator>
                <i class="pi pi-chevron-down"></i>
              </template>
            </pv-select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-car"></i>
              <span>Modelo</span>
            </label>
            <pv-select 
              v-model="selectedModel" 
              :options="filteredModels" 
              optionLabel="name" 
              placeholder="Selecciona modelo" 
              class="filter-select"
              :disabled="!selectedBrand"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="model-value">
                  <span>{{ slotProps.value.name }}</span>
                  <span class="model-category">{{ slotProps.value.category }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              
              <template #option="slotProps">
                <div class="model-option">
                  <span>{{ slotProps.option.name }}</span>
                  <span class="model-category">{{ slotProps.option.category }}</span>
                </div>
              </template>
              
              <template #indicator>
                <i class="pi pi-chevron-down"></i>
              </template>
            </pv-select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">
              <i class="pi pi-map-marker"></i>
              <span>Distancia</span>
            </label>
            <pv-select 
              v-model="selectedDistance" 
              :options="distanceOptions" 
              optionLabel="name" 
              placeholder="Selecciona distancia" 
              class="filter-select"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="distance-value">
                  <i class="pi pi-map-marker"></i>
                  <span>{{ slotProps.value.name }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              
              <template #option="slotProps">
                <div class="distance-option">
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
              
              <template #indicator>
                <i class="pi pi-chevron-down"></i>
              </template>
            </pv-select>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="button-container">
          <pv-button 
            type="button" 
            icon="pi pi-trash" 
            class="clear-button" 
            @click="clearFilters" 
            label="Limpiar" 
            outlined
          />
          
          <pv-button 
            type="button" 
            icon="pi pi-search" 
            class="search-button" 
            @click="search" 
            :loading="loading"
            :disabled="!isFormValid"
            label="Buscar"
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
  width: 60%;
  max-height: 120px;
  transition: transform 0.3s ease;
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


/* Botones */
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
  box-shadow: 
    0 4px 12px rgba(37, 99, 235, 0.2),
    0 2px 4px rgba(37, 99, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

:deep(.search-button:hover:not(:disabled)) {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(37, 99, 235, 0.25),
    0 4px 8px rgba(37, 99, 235, 0.15);
  background: linear-gradient(to right, #2563eb, #1d4ed8);
}

:deep(.search-button:active:not(:disabled)) {
  transform: translateY(1px);
  box-shadow: 
    0 2px 8px rgba(37, 99, 235, 0.2),
    0 1px 3px rgba(37, 99, 235, 0.1);
}

:deep(.search-button:disabled) {
  opacity: 0.7;
  cursor: not-allowed;
}

:deep(.clear-button) {
  min-width: 120px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(.clear-button:hover) {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
}

/* Estilos para los componentes PrimeVue */
:deep(.p-select),
:deep(.pv-select) {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.p-select:hover:not(:disabled)),
:deep(.pv-select:hover:not(:disabled)) {
  border-color: #cbd5e1;
  background-color: #ffffff;
}

:deep(.p-select:focus),
:deep(.pv-select:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  background-color: #ffffff;
}

:deep(.p-select:disabled),
:deep(.pv-select:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f1f5f9;
}

:deep(.p-select-label),
:deep(.pv-select-label) {
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  color: #334155;
}

:deep(.p-select-trigger),
:deep(.pv-select-trigger) {
  width: 3rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

:deep(.p-select-panel),
:deep(.pv-select-panel) {
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  margin-top: 5px;
  overflow: hidden;
}

:deep(.p-select-items-wrapper),
:deep(.pv-select-items-wrapper) {
  max-height: 250px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

:deep(.p-select-items-wrapper::-webkit-scrollbar),
:deep(.pv-select-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}

:deep(.p-select-items-wrapper::-webkit-scrollbar-track),
:deep(.pv-select-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 10px;
}

:deep(.p-select-items-wrapper::-webkit-scrollbar-thumb),
:deep(.pv-select-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #cbd5e1;
  border-radius: 10px;
}

:deep(.p-select-items),
:deep(.pv-select-items) {
  padding: 0.25rem;
  background: #ffffff;
}

:deep(.p-select-item),
:deep(.pv-select-item) {
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  color: #334155;
  font-size: 0.95rem;
  border-radius: 8px;
  margin: 0.2rem 0;
  display: flex;
  align-items: center;
}

:deep(.p-select-item:hover),
:deep(.pv-select-item:hover) {
  background-color: #eff6ff !important;
  color: #3b82f6 !important;
  transform: translateX(2px);
}

:deep(.p-select-item.p-highlight),
:deep(.pv-select-item.p-highlight) {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
}

:deep(.p-select-empty-message),
:deep(.pv-select-empty-message) {
  padding: 0.75rem 1rem;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
}

:deep(.p-select-trigger-icon),
:deep(.pv-select-trigger-icon) {
  transition: transform 0.3s ease;
}

:deep(.p-select.p-select-open .p-select-trigger-icon),
:deep(.pv-select.p-select-open .pv-select-trigger-icon) {
  transform: rotate(180deg);
}

:deep(.p-select-panel),
:deep(.pv-select-panel) {
  transform-origin: top;
  animation: selectFadeIn 0.2s ease-out;
}

:deep(.p-slider) {
  margin: 1rem 0.5rem;
}

:deep(.p-slider .p-slider-handle) {
  background: #3b82f6;
  border: 2px solid #3b82f6;
  transition: all 0.2s ease;
}

:deep(.p-slider .p-slider-handle:hover) {
  background: #2563eb;
  border-color: #2563eb;
  transform: scale(1.1);
}

:deep(.p-slider .p-slider-range) {
  background: #3b82f6;
}

@keyframes selectFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .filter-section {
    padding: 1.5rem;
  }
  
  .button-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  :deep(.search-button),
  :deep(.clear-button) {
    width: 100%;
  }
  
  .brand-phrase-image {
    width: 80%;
  }
  
  .search-header {
    padding: 1.25rem 1.5rem;
  }
  
  .search-header h2 {
    font-size: 1.25rem;
  }
}
</style>