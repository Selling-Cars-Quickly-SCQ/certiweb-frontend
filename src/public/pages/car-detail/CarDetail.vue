<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { carService } from '../../../certifications/services/car.service';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const car = ref(null);
const carPdf = ref(null);
const loading = ref(true);
const loadingPdf = ref(false);
const error = ref(null);
const { t } = useI18n();

const carId = computed(() => {
  const params = route.params;
  console.log('Full route params:', params);
  console.log('Raw ID:', params.id, typeof params.id);
  
  if (params.id && typeof params.id === 'string') {
    return params.id;
  } else if (params.id && typeof params.id === 'object') {
    return String(params.id.id || params.id.value || params.id);
  } else {
    console.error('No valid ID found in route params:', params);
    return null;
  }
});

const fetchCarDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!carId.value || carId.value === 'null' || carId.value === 'undefined') {
      throw new Error('ID de auto no válido');
    }
    
    console.log('Fetching car with ID:', carId.value);
    
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

const fetchCarPdf = async () => {
  if (!car.value?.hasPdfCertification) {
    console.log('Car does not have PDF certification');
    return;
  }
  
  try {
    loadingPdf.value = true;
    const pdfResponse = await carService.getCarPdf(carId.value);
    
    let base64Data = pdfResponse.pdfCertification?.base64Data || pdfResponse.pdfCertification;
    
    if (base64Data && !base64Data.startsWith('data:')) {
      carPdf.value = `data:application/pdf;base64,${base64Data}`;
    } else {
      carPdf.value = base64Data;
    }
    
    console.log('PDF loaded successfully');
  } catch (err) {
    console.error('Error fetching car PDF:', err);
  } finally {
    loadingPdf.value = false;
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

const contactSeller = () => {
  if (car.value && car.value.ownerEmail) {
    const subject = encodeURIComponent(t('carDetail.emailSubject', { model: car.value.model, brand: car.value.brand }));
    const body = encodeURIComponent(t('carDetail.emailBody', { 
        model: car.value.model, 
        brand: car.value.brand, 
        licensePlate: car.value.licensePlate 
    }));
    window.location.href = `mailto:${car.value.ownerEmail}?subject=${subject}&body=${body}`;
  } else {
    console.warn('No owner email available to contact.');
    alert(t('carDetail.noEmailWarning'));
  }
};

onMounted(async () => {
  console.log('=== DEBUGGING ROUTE ===');
  console.log('Current route:', route);
  console.log('Route params:', route.params);
  console.log('Route path:', route.path);
  console.log('Computed carId:', carId.value);
  console.log('======================');
  
  await fetchCarDetails();
  if (car.value?.hasPdfCertification) {
    await fetchCarPdf();
  }
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

        <!-- PDF -->
        <div class="section-block technical-report-section" v-if="car.hasPdfCertification">
          <h3 class="section-title"><i class="pi pi-file-pdf"></i> {{ t('carDetail.techCert') }}</h3>
          
          <!-- Loading PDF -->
          <div v-if="loadingPdf" class="pdf-loading">
            <pv-progress-spinner size="small" />
            <span>Cargando certificación PDF...</span>
          </div>
          
          <!-- PDF Loaded -->
          <div v-else-if="carPdf" class="pdf-content">
            <div class="pdf-actions">
              <pv-button 
                :label="t('carDetail.viewCert')"
                icon="pi pi-eye"
                @click="openReportInNewTab(carPdf)"
                class="p-button-info p-mr-2" 
              />
              <pv-button 
                :label="t('carDetail.downloadCert')"
                icon="pi pi-download"
                @click="downloadReport(carPdf)"
                class="p-button-success" 
              />
            </div>
            <div class="pdf-preview-container">
              <iframe :src="carPdf" class="pdf-iframe" :title="t('carDetail.techCert')"></iframe>
            </div>
          </div>
          
          <!-- PDF Error -->
          <div v-else class="pdf-error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>Error al cargar la certificación PDF</span>
            <pv-button 
              label="Reintentar" 
              icon="pi pi-refresh" 
              @click="fetchCarPdf" 
              class="p-button-outlined p-button-sm" 
            />
          </div>
        </div>
        
        <!-- No PDF -->
        <div v-else class="section-block">
            <h3 class="section-title"><i class="pi pi-file-excel"></i> {{ t('carDetail.techCert') }}</h3>
            <p>{{ t('carDetail.noCert') }}</p>
        </div>

        <div class="actions-footer">
          <pv-button 
            :label="t('carDetail.contactSeller')" 
            icon="pi pi-envelope" 
            class="p-button-raised p-button-primary" 
            @click="contactSeller" 
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
.pdf-loading {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
  justify-content: center;
}

.pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #fff5f5;
  border-radius: 8px;
  border: 2px dashed #fecaca;
  color: #dc2626;
}

.car-detail-container {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.back-button {
  margin-bottom: 2rem;
  color: #007bff !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 25px !important;
  transition: all 0.3s ease !important;
}

.back-button:hover {
  background: rgba(0, 123, 255, 0.1) !important;
  transform: translateX(-2px) !important;
}

.loading-spinner,
.error-message,
.no-car-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #555;
  padding: 2rem;
}

.loading-spinner p {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.error-message i, 
.no-car-found i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #dc3545;
}

.no-car-found i {
  color: #6c757d;
}

.error-message p, 
.no-car-found p {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.car-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

.image-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-car-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  min-height: 300px;
  max-height: 500px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.main-car-image:hover {
  transform: scale(1.02);
}

.details-section {
  padding: 0;
}

.car-main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.car-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #007bff;
}

.car-meta span {
  display: flex;
  align-items: center;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.car-meta i {
  margin-right: 0.75rem;
  color: #007bff;
  font-size: 1.1rem;
}

.price-tag {
  font-size: 2.2rem;
  font-weight: 800;
  color: #28a745;
  margin-bottom: 2rem;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 12px;
  display: inline-block;
  border: 2px solid rgba(40, 167, 69, 0.2);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.section-block {
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #34495e;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #007bff;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #007bff;
  font-size: 1.3rem;
}

.car-full-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.technical-report-section .pdf-actions {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.pdf-actions :deep(.p-button) {
  padding: 0.875rem 1.5rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
}

.pdf-preview-container {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  height: 600px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
  position: relative;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.actions-footer {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.actions-footer :deep(.p-button) {
  padding: 1rem 2.5rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 25px !important;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

.actions-footer :deep(.p-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4) !important;
}

/* Responsive Design */
@media (min-width: 1200px) {
  .car-content-grid {
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
  }
  
  .details-section {
    padding-left: 2rem;
  }
}

@media (max-width: 1024px) {
  .car-detail-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .car-main-title {
    font-size: 2.2rem;
  }
  
  .price-tag {
    font-size: 2rem;
    padding: 1rem 1.5rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .pdf-preview-container {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .car-detail-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .back-button {
    margin-bottom: 1.5rem;
    padding: 0.625rem 1.25rem !important;
    font-size: 0.95rem !important;
  }
  
  .car-content-grid {
    gap: 2rem;
  }
  
  .car-main-title {
    font-size: 1.875rem;
    margin-bottom: 1rem;
  }
  
  .car-meta {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
  }
  
  .car-meta span {
    justify-content: center;
    padding: 0.75rem 1rem;
  }
  
  .price-tag {
    font-size: 1.75rem;
    padding: 1rem 1.25rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }
  
  .section-block {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .car-full-description {
    font-size: 1rem;
    padding: 1.25rem;
  }
  
  .pdf-actions {
    flex-direction: column;
  }
  
  .pdf-actions :deep(.p-button) {
    width: 100% !important;
    justify-content: center !important;
  }
  
  .pdf-preview-container {
    height: 400px;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
  }
  
  .pdf-iframe {
    display: none;
  }
  
  .pdf-preview-container::after {
    content: "Para una mejor experiencia, utiliza los botones de arriba para ver o descargar el certificado PDF";
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.5;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
    max-width: 100%;
  }
  
  .actions-footer {
    padding: 1.5rem;
  }
  
  .actions-footer :deep(.p-button) {
    width: 100% !important;
    padding: 0.875rem 2rem !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .car-detail-container {
    padding: 0.75rem;
    margin: 0.25rem;
    border-radius: 12px;
  }
  
  .car-main-title {
    font-size: 1.625rem;
    text-align: center;
  }
  
  .car-meta {
    padding: 1rem;
  }
  
  .car-meta span {
    font-size: 0.9rem;
    padding: 0.625rem 0.875rem;
  }
  
  .price-tag {
    font-size: 1.5rem;
    padding: 0.75rem 1rem;
  }
  
  .section-block {
    padding: 1.25rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .car-full-description {
    font-size: 0.95rem;
    padding: 1rem;
  }
  
  .pdf-preview-container {
    height: 300px;
    padding: 0.75rem;
  }
  
  .pdf-preview-container::after {
    font-size: 0.85rem;
    padding: 1.25rem;
  }
  
  .actions-footer {
    padding: 1.25rem;
  }
  
  .actions-footer :deep(.p-button) {
    padding: 0.75rem 1.5rem !important;
    font-size: 0.95rem !important;
  }
}

@media (max-width: 360px) {
  .car-detail-container {
    padding: 0.5rem;
  }
  
  .car-main-title {
    font-size: 1.5rem;
  }
  
  .price-tag {
    font-size: 1.375rem;
    padding: 0.75rem 0.875rem;
  }
  
  .section-block {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .pdf-preview-container {
    height: 250px;
    padding: 0.5rem;
  }
  
  .pdf-preview-container::after {
    font-size: 0.8rem;
    padding: 1rem;
  }
}

@media (min-width: 769px) {
  .pdf-preview-container::after {
    display: none;
  }
  
  .pdf-iframe {
    display: block !important;
  }
}
</style>