<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { carService } from '../../../certifications/services/car.service';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const car = ref(null);
const loading = ref(true);
const error = ref(null);

const carId = computed(() => route.params.id);

const fetchCarDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await carService.getCarById(carId.value);
    car.value = response.data || response; 
    
    console.log('Car details loaded:', car.value);
  } catch (err) {
    console.error('Error fetching car details:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const downloadReport = (base64Data) => {
  if (!base64Data) {
    console.warn('No technical report data provided.');
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = `technical_report_${car.value.brand}_${car.value.model}_${car.value.licensePlate}.pdf`; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    window.open(base64Data, '_blank');
  }
};

const openReportInNewTab = (base64Data) => {
  if (!base64Data) {
    console.warn('No technical report data provided.');
    return;
  }
  
  window.open(base64Data, '_blank');
};

const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return value;
  }
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(numValue);
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchCarDetails();
});
</script>

<template>
  <div class="car-detail-container">
    <pv-button 
      icon="pi pi-arrow-left" 
      :label="t('carDetail.backButton')" 
      @click="goBack" 
      class="p-button-text back-button" 
    />

    <div v-if="loading" class="loading-spinner">
      <pv-progress-spinner />
      <p>{{ t('carDetail.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-message">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ t('carDetail.error') }} {{ error.message }}</p>
      <pv-button 
        :label="t('carDetail.tryAgain')" 
        @click="fetchCarDetails" 
        icon="pi pi-refresh" 
        class="p-button-outlined" 
      />
    </div>

    <div v-else-if="car" class="car-content-grid">
      <!-- Image Gallery Section -->
      <div class="image-gallery">
        <img 
          :src="car.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'" 
          :alt="car.model" 
          class="main-car-image" 
        />
      </div>

      <!-- Details Section -->
      <div class="details-section">
        <h1 class="car-main-title">{{ car.title }}</h1>
        <div class="car-meta">
          <span><i class="pi pi-tag"></i> {{ t('carDetail.brand') }} {{ car.brand }}</span>
          <span><i class="pi pi-car"></i> {{ t('carDetail.model') }} {{ car.model }}</span>
          <span><i class="pi pi-calendar"></i> {{ t('carDetail.year') }} {{ car.year }}</span>
        </div>

        <div class="price-tag">{{ formatCurrency(car.price) }}</div>

        <div class="section-block">
          <h3 class="section-title"><i class="pi pi-user"></i> {{ t('carDetail.ownerInfo') }}</h3>
          <p><strong>{{ t('carDetail.owner') }}</strong> {{ car.owner }}</p>
          <p><strong>{{ t('carDetail.licensePlate') }}</strong> {{ car.licensePlate }}</p>
        </div>

        <div class="section-block">
          <h3 class="section-title"><i class="pi pi-align-left"></i> {{ t('carDetail.description') }}</h3>
          <p class="car-full-description">{{ car.description || t('carDetail.noDescription') }}</p>
        </div>

        <div class="section-block technical-report-section" v-if="car.pdfCertification">
          <h3 class="section-title"><i class="pi pi-file-pdf"></i> {{ t('carDetail.techCert') }}</h3>
          <div class="pdf-actions">
            <pv-button 
              :label="t('carDetail.viewCert')"
              icon="pi pi-eye"
              @click="openReportInNewTab(car.pdfCertification)"
              class="p-button-info p-mr-2" 
            />
            <pv-button 
              :label="t('carDetail.downloadCert')"
              icon="pi pi-download"
              @click="downloadReport(car.pdfCertification)"
              class="p-button-success" 
            />
          </div>
          <div class="pdf-preview-container">
            <iframe :src="car.pdfCertification" class="pdf-iframe" :title="t('carDetail.techCert')"></iframe>
          </div>
        </div>
        <div v-else class="section-block">
            <h3 class="section-title"><i class="pi pi-file-excel"></i> {{ t('carDetail.techCert') }}</h3>
            <p>{{ t('carDetail.noCert') }}</p>
        </div>

        <div class="actions-footer">
          <pv-button 
            :label="t('carDetail.contactSeller')" 
            icon="pi pi-envelope" 
            class="p-button-raised p-button-primary" 
          />
        </div>
      </div>
    </div>
    
    <div v-else class="no-car-found">
      <i class="pi pi-car"></i>
      <p>{{ t('carDetail.notFound') }}</p>
    </div>
  </div>
</template>

<style scoped>
.car-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
}

.back-button {
  margin-bottom: 1.5rem;
  color: #007bff;
}

.loading-spinner,
.error-message,
.no-car-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #555;
}

.loading-spinner p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.error-message i, .no-car-found i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dc3545;
}
.no-car-found i {
    color: #6c757d;
}

.error-message p, .no-car-found p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.car-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 992px) {
  .car-content-grid {
    grid-template-columns: 2fr 3fr;
  }
}

.image-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-car-image {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem; /* Space for potential thumbnails */
}

.thumbnail-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.thumbnail-image { width: 80px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid transparent; }
.thumbnail-image.active { border-color: #007bff; }

.details-section {
  padding-left: 0;
}

@media (min-width: 992px) {
  .details-section {
    padding-left: 1.5rem;
  }
}

.car-main-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.car-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.car-meta span {
  display: flex;
  align-items: center;
}

.car-meta i {
  margin-right: 0.5rem;
  color: #007bff;
}

.price-tag {
  font-size: 1.8rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #e9f5ec;
  border-radius: 6px;
  display: inline-block;
}

.section-block {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #007bff;
  display: inline-block;
}

.section-title i {
  margin-right: 0.6rem;
}

.car-full-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
  white-space: pre-wrap;
}

.technical-report-section .pdf-actions {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
}

.pdf-preview-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    height: 500px;
    margin-top: 1rem;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.actions-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
}

:deep(.p-button) {
  font-weight: 500;
}

</style>