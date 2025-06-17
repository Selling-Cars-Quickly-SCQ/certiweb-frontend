<script setup>
import { ref, defineEmits, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
    console.log('Archivo original:', selectedFile.value.name);
    console.log('Tamaño del archivo:', selectedFile.value.size);
    console.log('Tipo de archivo:', selectedFile.value.type);
    console.log('Base64 original (primeros 100 chars):', base64Data.value.substring(0, 100));
    
    const pdfToSend = base64Data.value;
    
    console.log('PDF final a enviar (primeros 100 chars):', pdfToSend.substring(0, 100));
    console.log('Longitud del PDF final:', pdfToSend.length);
    console.log('Prefijo verificado:', pdfToSend.startsWith('data:application/pdf;base64,') ? 'SÍ TIENE PREFIJO' : 'NO TIENE PREFIJO');
    
    emit('pdfUploaded', {
      carId: props.carId,
      pdfCertification: pdfToSend,
      fileName: selectedFile.value.name
    });
    
    console.log(`PDF enviado para el auto ${props.carId} con prefijo completo`);
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
          <h3 class="section-title">{{ t('uploadTechReport.title') }}</h3>
          <p class="section-subtitle">{{ t('uploadTechReport.subtitle', { carId: carId }) }}</p>
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
            <h4 class="upload-title">{{ t('uploadZone.selectOrDrag') }}</h4>
            <p class="upload-description">
              {{ t('uploadZone.supportedFormats') }}
            </p>
          </div>

          <pv-fileupload 
            mode="basic" 
            name="informe" 
            accept=".pdf"
            :maxFileSize="10000000" 
            @select="onSelect" 
            :chooseLabel="t('uploadZone.selectFile')"
            class="custom-file-upload"
            :auto="false" 
          />

          <div class="upload-features">
            <div class="feature-item">
              <i class="pi pi-shield feature-icon"></i>
              <span>{{ t('uploadZone.features.secure') }}</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-clock feature-icon"></i>
              <span>{{ t('uploadZone.features.fast') }}</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check feature-icon"></i>
              <span>{{ t('uploadZone.features.validation') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- File Selected State -->
      <div v-if="selectedFile" class="file-selected">
        <!-- Upload Progress -->
        <div v-if="isUploading" class="upload-progress">
          <div class="progress-header">
            <span class="progress-text">{{ t('fileState.processing') }}</span>
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
                <span class="file-type">{{ t('fileState.fileType') }}</span>
              </div>
              <div class="file-validation" :class="{ 'valid': isValidFile }">
                <i :class="isValidFile ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
                <span>{{ isValidFile ? t('fileState.validFile') : t('fileState.invalidFormat') }}</span>
              </div>
              <div v-if="base64Data" class="base64-info">
                <i class="pi pi-database"></i>
                <span>{{ t('fileState.base64Generated', { size: Math.round(base64Data.length / 1024) }) }}</span>
              </div>
            </div>

            <pv-button 
              v-if="!isUploading"
              @click="removeFile"
              class="remove-button"
              :title="t('fileState.removeFile')"
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
              {{ t('preview.title') }}
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
                  {{ t('preview.description') }}
                </p>
                <div class="preview-actions">
                  <pv-button class="preview-button" @click="downloadPreview">
                    <i class="pi pi-download"></i>
                    {{ t('preview.actions.download') }}
                  </pv-button>
                  <pv-button class="preview-button" @click="openPreview">
                    <i class="pi pi-external-link"></i>
                    {{ t('preview.actions.open') }}
                  </pv-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload to Database Button -->
        <div v-if="!isUploading && isValidFile && base64Data" class="upload-to-db">
          <pv-button 
            :label="t('uploadButton.label')"
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
              <h6 class="success-title">{{ t('successMessage.title') }}</h6>
              <p class="success-description">
                {{ t('successMessage.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container Styles */
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Styles */
.form-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.header-text {
  flex: 1;
  min-width: 200px;
}

.main-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

/* Progress Section */
.progress-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.progress-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
}

.progress-percentage {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.95rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Form Content */
.form-content {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
  flex-wrap: wrap;
}

.section-icon {
  color: #3b82f6;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

/* Field Header */
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  flex: 1;
  min-width: 0;
}

.label-icon {
  color: #3b82f6;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.label-text {
  word-break: break-word;
}

.field-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.field-badge.editable {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fbbf24;
}

.field-badge.readonly {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
}

.readonly-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.85rem;
  pointer-events: none;
}

.input-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.input-hint i {
  color: #3b82f6;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.textarea-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.7rem;
  color: #9ca3af;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* Form Actions */
.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.save-button {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
  transition: all 0.3s ease !important;
  width: 100%;
  max-width: 300px;
}

.save-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5) !important;
}

.save-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* Form Status */
.form-status {
  margin-top: 2rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid #fbbf24;
  background: #fef3c7;
  transition: all 0.3s ease;
}

.form-status.valid {
  border-color: #10b981;
  background: #d1fae5;
}

.status-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.status-icon {
  font-size: 1.25rem;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.form-status.valid .status-icon {
  color: #10b981;
}

.status-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.status-title {
  font-weight: 600;
  color: #92400e;
  font-size: 0.95rem;
  line-height: 1.3;
}

.form-status.valid .status-title {
  color: #065f46;
}

.status-description {
  font-size: 0.85rem;
  color: #a16207;
  line-height: 1.4;
}

.form-status.valid .status-description {
  color: #047857;
}

/* PrimeVue Component Overrides */
:deep(.form-input) {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

:deep(.form-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.editable-input) {
  background: #fffbeb !important;
  border-color: #fbbf24;
}

:deep(.editable-input:focus) {
  background: white !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.readonly-input) {
  background: #f9fafb !important;
  color: #6b7280 !important;
  cursor: not-allowed;
  border-color: #d1d5db;
}

:deep(.form-textarea) {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #fffbeb;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

:deep(.form-textarea:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

/* Responsive Design */
@media (min-width: 576px) {
  .form-container {
    padding: 1.5rem;
  }
  
  .form-header,
  .form-content {
    padding: 2rem;
  }
  
  .header-content {
    flex-wrap: nowrap;
  }
  
  .header-icon {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .field-header {
    align-items: center;
    flex-wrap: nowrap;
  }
  
  .save-button {
    width: auto !important;
    padding: 1.25rem 2.5rem !important;
    font-size: 1.1rem !important;
  }
}

@media (min-width: 768px) {
  .form-container {
    padding: 2rem;
  }
  
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .section-header {
    flex-wrap: nowrap;
  }
  
  .section-icon {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .status-content {
    align-items: center;
  }
}

@media (min-width: 992px) {
  .form-header,
  .form-content {
    padding: 2.5rem;
  }
  
  .main-title {
    font-size: 2.25rem;
  }
  
  .header-icon {
    width: 4rem;
    height: 4rem;
    font-size: 1.75rem;
  }
  
  .progress-section {
    padding: 1.5rem;
  }
  
  .form-status {
    padding: 1.5rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-header,
  .form-content {
    border: 2px solid #000;
  }
  
  .main-title {
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>