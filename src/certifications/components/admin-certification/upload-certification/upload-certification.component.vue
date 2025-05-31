<script setup>
import { ref, defineEmits, computed } from 'vue';

const selectedFile = ref(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const base64Data = ref(null);

const props = defineProps({
  carId: {
    type: [String, Number],
    required: true
  },
  isUploadingPdf: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['pdfUploaded']);

const fileSize = computed(() => {
  if (!selectedFile.value) return '';
  const size = selectedFile.value.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

const isValidFile = computed(() => {
  return selectedFile.value && selectedFile.value.type === 'application/pdf';
});

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const onSelect = async (event) => {
  selectedFile.value = event.files[0];
  try {
    const base64Result = await convertToBase64(selectedFile.value);
    base64Data.value = base64Result;
    
    console.log('PDF converted to base64:', base64Result.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error converting file:', error);
  }
  simulateUpload();
};

const simulateUpload = () => {
  isUploading.value = true;
  uploadProgress.value = 0;
  
  const interval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      isUploading.value = false;
    }
  }, 100);
};

const uploadPdfToDatabase = async () => {
  if (!base64Data.value || !props.carId) {
    console.error('No hay PDF o ID de auto para subir');
    return;
  }

  try {
    emit('pdfUploaded', {
      carId: props.carId,
      pdfCertification: base64Data.value,
      fileName: selectedFile.value.name
    });
    
    console.log(`PDF enviado para el auto ${props.carId}`);
  } catch (error) {
    console.error('Error al enviar PDF:', error);
  }
};

const removeFile = () => {
  selectedFile.value = null;
  base64Data.value = null;
  uploadProgress.value = 0;
  isUploading.value = false;
};

const downloadPreview = () => {
  if (base64Data.value) {
    const link = document.createElement('a');
    link.href = base64Data.value;
    link.download = selectedFile.value.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const openPreview = () => {
  if (base64Data.value) {
    window.open(base64Data.value, '_blank');
  }
};

const onDragEnter = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = () => {
  isDragOver.value = false;
};
</script>

<template>
  <div class="upload-container">
    <!-- Header Section -->
    <div class="upload-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="pi pi-file-pdf"></i>
        </div>
        <div class="header-text">
          <h3 class="section-title">Subir Informe Técnico</h3>
          <p class="section-subtitle">Suba el documento PDF del informe técnico para el auto ID: {{ carId }}</p>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="upload-content">
      <!-- File Upload Zone -->
      <div 
        v-if="!selectedFile"
        class="upload-zone"
        :class="{ 'drag-over': isDragOver }"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <div class="upload-zone-content">
          <div class="upload-icon">
            <i class="pi pi-cloud-upload"></i>
          </div>
          
          <div class="upload-text">
            <h4 class="upload-title">Seleccione o arrastre su archivo PDF</h4>
            <p class="upload-description">
              Formatos soportados: PDF • Tamaño máximo: 10MB
            </p>
          </div>

          <pv-fileupload 
            mode="basic" 
            name="informe" 
            accept=".pdf"
            :maxFileSize="10000000" 
            @select="onSelect" 
            chooseLabel="Seleccionar Archivo"
            class="custom-file-upload"
            :auto="false" 
          />

          <div class="upload-features">
            <div class="feature-item">
              <i class="pi pi-shield feature-icon"></i>
              <span>Seguro y encriptado</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-clock feature-icon"></i>
              <span>Procesamiento rápido</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check feature-icon"></i>
              <span>Validación automática</span>
            </div>
          </div>
        </div>
      </div>

      <!-- File Selected State -->
      <div v-if="selectedFile" class="file-selected">
        <!-- Upload Progress -->
        <div v-if="isUploading" class="upload-progress">
          <div class="progress-header">
            <span class="progress-text">Procesando archivo...</span>
            <span class="progress-percentage">{{ uploadProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- File Info Card -->
        <div class="file-card" :class="{ 'uploading': isUploading }">
          <div class="file-info">
            <div class="file-icon-wrapper">
              <div class="file-icon">
                <i class="pi pi-file-pdf"></i>
              </div>
              <div v-if="isValidFile" class="file-status valid">
                <i class="pi pi-check"></i>
              </div>
            </div>
            
            <div class="file-details">
              <h5 class="file-name">{{ selectedFile.name }}</h5>
              <div class="file-meta">
                <span class="file-size">{{ fileSize }}</span>
                <span class="file-type">PDF Document</span>
              </div>
              <div class="file-validation" :class="{ 'valid': isValidFile }">
                <i :class="isValidFile ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
                <span>{{ isValidFile ? 'Archivo válido' : 'Formato no válido' }}</span>
              </div>
              <div v-if="base64Data" class="base64-info">
                <i class="pi pi-database"></i>
                <span>Base64 generado ({{ Math.round(base64Data.length / 1024) }} KB)</span>
              </div>
            </div>

            <pv-button 
              v-if="!isUploading"
              @click="removeFile"
              class="remove-button"
              title="Eliminar archivo"
            >
              <i class="pi pi-times"></i>
            </pv-button>
          </div>
        </div>

        <!-- PDF Preview -->
        <div v-if="isValidFile && !isUploading && base64Data" class="pdf-preview">
          <div class="preview-header">
            <h5 class="preview-title">
              <i class="pi pi-eye"></i>
              Vista Previa del Documento
            </h5>
          </div>
          
          <div class="preview-content">
            <div class="preview-card">
              <div class="preview-icon">
                <i class="pi pi-file-pdf"></i>
              </div>
              <div class="preview-info">
                <h6 class="preview-filename">{{ selectedFile.name }}</h6>
                <p class="preview-description">
                  Documento PDF convertido a Base64 y listo para guardar
                </p>
                <div class="preview-actions">
                  <pv-button class="preview-button" @click="downloadPreview">
                    <i class="pi pi-download"></i>
                    Descargar
                  </pv-button>
                  <pv-button class="preview-button" @click="openPreview">
                    <i class="pi pi-external-link"></i>
                    Abrir
                  </pv-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload to Database Button -->
        <div v-if="!isUploading && isValidFile && base64Data" class="upload-to-db">
          <pv-button 
            label="Subir PDF a la Base de Datos"
            icon="pi pi-cloud-upload"
            class="upload-db-button"
            @click="uploadPdfToDatabase"
            :disabled="props.isUploadingPdf"
            :loading="props.isUploadingPdf"
          />
        </div>

        <!-- Success Message -->
        <div v-if="!isUploading && isValidFile && base64Data" class="success-message">
          <div class="success-content">
            <div class="success-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="success-text">
              <h6 class="success-title">¡Archivo procesado exitosamente!</h6>
              <p class="success-description">
                El informe técnico está listo para ser guardado en la base de datos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base64-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #059669;
  background: #d1fae5;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.base64-info .pi-database {
  color: #047857;
}

.upload-to-db {
  margin-top: 1.5rem;
  text-align: center;
}

.upload-db-button {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
  transition: all 0.3s ease !important;
}

.upload-db-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5) !important;
}

/* Container Styles */
.upload-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.upload-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
}

.header-text {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

/* Upload Content */
.upload-content {
  position: relative;
}

/* Upload Zone */
.upload-zone {
  border: 3px dashed #d1d5db;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
}

.upload-zone-content {
  position: relative;
  z-index: 1;
}

.upload-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.upload-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.upload-description {
  color: #64748b;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

.upload-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.feature-icon {
  color: #3b82f6;
  font-size: 1rem;
}

/* File Selected State */
.file-selected {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Upload Progress */
.upload-progress {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-text {
  font-weight: 600;
  color: #374151;
}

.progress-percentage {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* File Card */
.file-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.file-card:not(.uploading) {
  border-color: #10b981;
  background: #f0fdf4;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon-wrapper {
  position: relative;
}

.file-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.file-status {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  border: 2px solid white;
}

.file-status.valid {
  background: #10b981;
  color: white;
}

.file-details {
  flex: 1;
}

.file-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  word-break: break-word;
}

.file-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.file-size,
.file-type {
  font-size: 0.85rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.file-validation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.file-validation.valid {
  color: #059669;
}

.file-validation:not(.valid) {
  color: #dc2626;
}

.remove-button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-button:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* PDF Preview */
.pdf-preview {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.preview-header {
  margin-bottom: 1rem;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.preview-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.preview-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
}

.preview-info {
  flex: 1;
}

.preview-filename {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.preview-description {
  color: #64748b;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.preview-actions {
  display: flex;
  gap: 0.75rem;
}

.preview-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

/* Success Message */
.success-message {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #10b981;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  width: 3rem;
  height: 3rem;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.success-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #065f46;
  margin: 0 0 0.25rem 0;
}

.success-description {
  color: #047857;
  margin: 0;
  font-size: 0.9rem;
}

/* Custom File Upload Styling */
:deep(.custom-file-upload .p-fileupload-choose) {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  border: none !important;
  color: white !important;
  padding: 1rem 2rem !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

:deep(.custom-file-upload .p-fileupload-choose:hover) {
  background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .upload-container {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .upload-zone {
    padding: 2rem 1rem;
  }
  
  .upload-features {
    flex-direction: column;
    gap: 1rem;
  }
  
  .file-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .preview-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .preview-actions {
    justify-content: center;
  }
  
  .success-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>