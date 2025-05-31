<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { carService } from '../../../certifications/services/car.service';

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
    link.download = `informe_tecnico_${car.value.marca}_${car.value.modelo}_${car.value.licensePlate}.pdf`;
    
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
  router.push('/cars');
};

onMounted(() => {
  fetchCarDetails();
});
</script>

<template>
    <div class="car-detail-container p-d-flex p-jc-center p-ai-start p-py-5">
      <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="height: 50vh;">
        <pv-progress-spinner />
      </div>
      <div v-else-if="error" class="p-error p-text-center">
        <p>Error al cargar los detalles del auto: {{ error.message }}</p>
        <pv-button label="Volver a la lista" icon="pi pi-arrow-left" @click="goBack" class="p-mt-3" />
      </div>
      <div v-else-if="!car" class="p-text-center">
        <p>Auto no encontrado.</p>
        <pv-button label="Volver a la lista" icon="pi pi-arrow-left" @click="goBack" class="p-mt-3" />
      </div>
      <pv-card v-else class="car-detail-card p-shadow-5">
        <template #header>
          <div class="car-image-container">
            <img :src="car.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'" 
                 :alt="car.marca + ' ' + car.modelo + ' image'" 
                 class="car-detail-image" />
          </div>
        </template>
        <template #title>
          <div class="p-d-flex p-jc-between p-ai-center">
            <span>{{ car.marca }} {{ car.modelo }}</span>
            <pv-button icon="pi pi-arrow-left" label="Volver" @click="goBack" class="p-button-text p-button-sm" />
          </div>
        </template>
        <template #subtitle>
          <div>
            <p>Año: {{ car.ano }}</p>
            <p>{{ car.titulo }}</p>
          </div>
        </template>
        <template #content>
          <div class="p-grid">
            <div class="p-col-12 p-md-6">
              <p><strong>Propietario:</strong> {{ car.propietario }}</p>
              <p><strong>Precio:</strong> {{ formatCurrency(car.price) }}</p>
              <p><strong>Placa:</strong> {{ car.licensePlate }}</p>
              <p><strong>Descripción:</strong> {{ car.descripcion || 'No disponible' }}</p>
            </div>
            <div class="p-col-12 p-md-6">
              <div class="technical-report-section">
                <h4 class="report-title">
                  <i class="pi pi-file-pdf"></i>
                  Informe Técnico
                </h4>
                
                <!-- PDF Viewer -->
                <div v-if="car.pdfCertification && typeof car.pdfCertification === 'string'" class="pdf-container">
                  <div class="pdf-viewer">
                    <iframe 
                      :src="car.pdfCertification" 
                      width="100%" 
                      height="400px"
                      style="border: 1px solid #ddd; border-radius: 8px;"
                      title="Informe Técnico PDF">
                    </iframe>
                  </div>
                  
                  <!-- PDF Actions -->
                  <div class="pdf-actions">
                    <pv-button 
                      label="Descargar PDF" 
                      icon="pi pi-download" 
                      @click="downloadReport(car.pdfCertification)" 
                      class="p-button-outlined download-btn" />
                    <pv-button 
                      label="Abrir en nueva pestaña" 
                      icon="pi pi-external-link" 
                      @click="openReportInNewTab(car.pdfCertification)" 
                      class="p-button-text" />
                  </div>
                </div>
                
                <!-- No PDF Available -->
                <div v-else class="no-report">
                  <div class="no-report-icon">
                    <i class="pi pi-file-excel"></i>
                  </div>
                  <p>No hay informe técnico disponible</p>
                  <small v-if="car.pdfCertification && typeof car.pdfCertification === 'object'">
                    El PDF aún no ha sido subido
                  </small>
                </div>
              </div>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
</template>
  
<style scoped>
.car-detail-container {
  background: linear-gradient(135deg, #f5f0e1 0%, #f5f0e1 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
}

.car-detail-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  background: white;
}

.car-image-container {
  width: 100%;
  height: 450px;
  overflow: hidden;
  position: relative;
}

.car-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

.car-detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.car-detail-image:hover {
  transform: scale(1.05);
}

.car-detail-card .p-card-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.car-detail-card .p-card-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.car-detail-card .p-card-content {
  padding: 2rem;
}

.car-detail-card .p-card-content p {
  margin: 1rem 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #34495e;
}

.car-detail-card .p-card-content strong {
  color: #2c3e50;
  font-weight: 600;
}

/* Technical Report Section Enhanced */
.technical-report-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #dee2e6;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  margin-top: 1rem;
}

.report-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.report-title .pi-file-pdf {
  color: #e74c3c;
  font-size: 1.4rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pdf-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.pdf-viewer {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.pdf-viewer iframe {
  border: none !important;
  border-radius: 12px;
}

.pdf-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.download-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3) !important;
}

.download-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4) !important;
}

.p-button-text {
  color: #3498db !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.p-button-text:hover {
  background: rgba(52, 152, 219, 0.1) !important;
  transform: translateY(-1px) !important;
}

.no-report {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.no-report-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #e74c3c;
  opacity: 0.7;
}

.no-report p {
  margin: 0 0 0.75rem 0;
  font-style: italic;
  font-size: 1.1rem;
  font-weight: 500;
}

.no-report small {
  color: #adb5bd;
  font-size: 0.9rem;
}

/* Responsive Design Improvements */
@media (max-width: 768px) {
  .car-list-container {
    padding: 1rem;
  }
  
  .car-list-container h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .p-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .car-detail-container {
    padding: 1rem 0.5rem;
  }
  
  .car-detail-card {
    margin: 0;
    border-radius: 16px;
  }
  
  .car-image-container {
    height: 300px;
  }
  
  .car-detail-card .p-card-title {
    font-size: 1.8rem;
  }
  
  .car-detail-card .p-card-content {
    padding: 1.5rem;
  }
  
  .technical-report-section {
    padding: 1.5rem;
    margin-top: 1rem;
  }
  
  .pdf-viewer iframe {
    height: 300px !important;
  }
  
  .pdf-actions {
    flex-direction: column;
  }
  
  .pdf-actions .p-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .car-list-container h2 {
    font-size: 1.6rem;
  }
  
  .car-detail-card .p-card-title {
    font-size: 1.5rem;
  }
  
  .report-title {
    font-size: 1.1rem;
  }
  
  .pdf-viewer iframe {
    height: 250px !important;
  }
  
  .technical-report-section {
    padding: 1rem;
  }
  
  .no-report {
    padding: 2rem 1rem;
  }
  
  .no-report-icon {
    font-size: 3rem;
  }
}

/* Additional enhancements */
.car-card .p-card-content {
  position: relative;
}

.car-card .p-card-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3498db 0%, #2980b9 100%);
  border-radius: 2px;
}

/* Price highlighting */
.car-card .p-card-content p:has(strong:contains("Precio")),
.car-detail-card .p-card-content p:has(strong:contains("Precio")) {
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  font-weight: 600;
  color: #155724;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.car-card:focus-visible,
.p-button:focus-visible {
  outline: 2px solid #f5f0e1;
  outline-offset: 2px;
}
</style>  