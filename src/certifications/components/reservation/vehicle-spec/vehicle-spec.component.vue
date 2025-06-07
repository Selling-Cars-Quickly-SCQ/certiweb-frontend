<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { imgbbApiService } from '@/shared/services/imgbb-api.service';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const emit = defineEmits(['update:vehicleData']);

const fileupload1 = ref(null);

const imagen1 = ref(null);
const imagenCargada1 = ref(false);
const imagenUrl1 = ref('');
const cargandoImagen = ref(false);
const imagenId1 = ref('');

const formulario = reactive({
  marca: '',
  modelo: '',
  placa: '',
  precioVender: null,
  propietarioEmail: ''
});
const placaValida = ref(true);

const marcas = ref([
  { nombre: 'Toyota', codigo: 'toyota' },
  { nombre: 'Nissan', codigo: 'nissan' },
  { nombre: 'Hyundai', codigo: 'hyundai' },
  { nombre: 'Kia', codigo: 'kia' },
  { nombre: 'Chevrolet', codigo: 'chevrolet' },
  { nombre: 'Suzuki', codigo: 'suzuki' },
  { nombre: 'Mitsubishi', codigo: 'mitsubishi' },
  { nombre: 'Honda', codigo: 'honda' },
  { nombre: 'Volkswagen', codigo: 'volkswagen' },
  { nombre: 'Ford', codigo: 'ford' },
  { nombre: 'Mercedes-Benz', codigo: 'mercedes' },
  { nombre: 'Audi', codigo: 'audi' },
  { nombre: 'BMW', codigo: 'bmw' },
]);

const upload = () => {
  fileupload1.value.upload();
};

const handleCustomUpload = async (event) => {
  const file = event.files[0];

  imagen1.value = file;
  imagenCargada1.value = false;
  imagenUrl1.value = '';
  imagenId1.value = '';

  if (file.type !== 'image/jpeg') {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Solo se permiten imágenes JPG', life: 3000 });
    imagen1.value = null;
    return;
  }
  
  try {
      cargandoImagen.value = true;
      const resultado = await imgbbApiService.uploadImage(file);
  
      imagenUrl1.value = resultado.url;
      imagenId1.value = resultado.id;
      
      console.log('ID de la imagen subida:', resultado.id);
      console.log('url de la imagen subida:', resultado.url);
      
      imagenCargada1.value = true;
  
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `La imagen se envió correctamente (ID: ${resultado.id})`, 
        life: 3000 
      });
      emitVehicleData();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al subir la imagen: ' + (error.message || 'Desconocido'), life: 3000 });
    imagenCargada1.value = false; 
    imagenUrl1.value = '';
  } finally {
    cargandoImagen.value = false;
  }
};

const formatearPlaca = (event) => {
  let valor = event.target.value.toUpperCase();
  valor = valor.replace(/[^A-Z0-9-]/g, '');

  let valorSinGuion = valor.replace(/-/g, '');

  if (valorSinGuion.length > 3) {
    valor = valorSinGuion.substring(0, 3) + '-' + valorSinGuion.substring(3);
  } else {
    valor = valorSinGuion;
  }

  if (valor.length > 7) {
    valor = valor.substring(0, 7);
  }

  formulario.placa = valor;

  if (valor.length === 7) {
    placaValida.value = validarPlaca(valor);
    if (!placaValida.value) {
      toast.add({ severity: 'warn', summary: 'Placa Inválida', detail: 'El formato de la placa no es válido (Ej: ABC-123).', life: 3500 });
    }
  } else if (valor.length > 0 && valor.length < 7) {
    placaValida.value = false;
  } else {
    placaValida.value = true;
  }

  emitVehicleData();
};

const emitVehicleData = () => {
  emit('update:vehicleData', {
    ...formulario,
    imagenes: [
      { url: imagenUrl1.value, id: imagenId1.value }
    ].filter(img => !!img.url),
    imagenesCargadas: imagenCargada1.value
  });
};

const updateFormData = () => {
  emitVehicleData();
};

const validarPlaca = (placa) => {
  const regex = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  return regex.test(placa);
};
</script>

<template>
  <div class="vehicle-spec-container">
    <div class="seccion">
      <h2 class="subtitulo-formulario">{{ t('vehicleSpec.uploadPhoto') }}</h2>
      <div class="fotos-container">
        <div class="foto-upload" :class="{ 'foto-uploaded': imagenCargada1 }">
          <div class="upload-header">{{ t('vehicleSpec.vehiclePhoto') }}</div>
          <div class="upload-content">
            <pv-fileupload
              ref="fileupload1"
              mode="basic"
              name="demo[]"
              accept="image/*"
              :maxFileSize="1000000"
              :customUpload="true"
              @uploader="handleCustomUpload($event)"
              :class="{ 'imagen-cargada': imagenCargada1 }"
              :disabled="cargandoImagen"
              :chooseLabel="t('vehicleSpec.selectFile')"
              :auto="false"
            />
            <pv-button 
              :label="t('vehicleSpec.uploadImage')" 
              @click="upload" 
              severity="secondary" 
              :disabled="cargandoImagen" 
            />
          </div>
          <small class="upload-hint">{{ t('vehicleSpec.fileHint') }}</small>
          <div v-if="imagenCargada1 && imagenUrl1" class="imagen-preview">
            <img :src="imagenUrl1" alt="Vista previa" class="preview-thumbnail" />
            <span class="nombre-archivo">{{ imagen1?.name }}</span>
          </div>
          <div v-else-if="imagen1 && !imagenCargada1 && !cargandoImagen" class="imagen-preview-failed">
            <span class="nombre-archivo">{{ imagen1?.name }} {{ t('vehicleSpec.uploadError') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="seccion">
      <h2 class="subtitulo-formulario">{{ t('vehicleSpec.vehicleData') }}</h2>
      <div class="datos-vehiculo">
        <div class="campo-formulario">
            <label for="marca">{{ t('vehicleSpec.brand') }}</label>
            <div class="select-container">
                <select 
                  id="marca"
                  v-model="formulario.marca" 
                  @change="updateFormData"
                  class="custom-select"
                >
                  <option value="" disabled selected>{{ t('vehicleSpec.selectBrand') }}</option>
                  <option 
                    v-for="marca in marcas" 
                    :key="marca.codigo" 
                    :value="marca.codigo"
                  >
                    {{ marca.nombre }}
                  </option>
                </select>
                <div class="select-arrow">
                  <i class="pi pi-chevron-down"></i>
                </div>
            </div>     
        </div>
        <div class="campo-formulario">
          <label for="modelo">{{ t('vehicleSpec.model') }}</label>
          <pv-inputText
            id="modelo"
            v-model="formulario.modelo"
            :placeholder="t('vehicleSpec.modelPlaceholder')"
            @input="updateFormData"
            class="p-input-custom"
          />
        </div>

        <div class="campo-formulario">
          <label for="placa">{{ t('vehicleSpec.licensePlate') }}</label>
          <pv-inputText
            id="placa"
            v-model="formulario.placa"
            :placeholder="t('vehicleSpec.platePlaceholder')"
            @input="formatearPlaca"
            maxlength="7"
            class="p-input-custom"
            :class="{ 'p-invalid': !placaValida && formulario.placa.length > 0 }"
          />
          <small class="field-help">{{ t('vehicleSpec.plateFormat') }}</small>
          <small v-if="!placaValida && formulario.placa.length === 7" class="p-error">
            {{ t('vehicleSpec.plateErrorFormat') }}
          </small>
          <small v-else-if="!placaValida && formulario.placa.length > 0 && formulario.placa.length < 7" class="p-error">
            {{ t('vehicleSpec.plateIncomplete') }}
          </small>
        </div>

        <div class="campo-formulario">
          <label for="propietarioEmail">{{ t('vehicleSpec.ownerEmail') }}</label>
          <pv-inputText
            id="propietarioEmail"
            v-model="formulario.propietarioEmail"
            :placeholder="t('vehicleSpec.ownerEmailPlaceholder')"
            type="email"
            @input="updateFormData"
            class="p-input-custom"
          />
        </div>

        <div class="campo-formulario">
          <label for="precio">{{ t('vehicleSpec.sellingPrice') }}</label>
          <pv-inputText
            id="precio"
            v-model="formulario.precioVender"
            :placeholder="t('vehicleSpec.pricePlaceholder')"
            type="number"
            @input="updateFormData"
            class="p-input-custom"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vehicle-spec-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.seccion {
  margin-bottom: 3rem;
}

.subtitulo-formulario {
  color: #1e4d2b;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.75rem;
  text-align: center;
}

.subtitulo-formulario::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

.fotos-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.foto-upload {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 300px;
}

.foto-upload:hover {
  border-color: #1e4d2b;
  box-shadow: 0 4px 20px rgba(30, 77, 43, 0.15);
  transform: translateY(-2px);
}

.foto-uploaded {
  border-style: solid;
  border-color: #1e4d2b;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7e6 100%);
}

.upload-header {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  color: white;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.upload-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  flex: 1;
}

.upload-hint {
  padding: 0 1.5rem 1rem;
  color: #666;
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
  background: rgba(30, 77, 43, 0.05);
  margin: 0 1rem;
  border-radius: 8px;
  padding: 0.75rem;
}

.imagen-preview {
  margin: 0 1rem 1rem;
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(30, 77, 43, 0.2);
}

.imagen-preview-failed {
  margin: 0 1rem 1rem;
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #fff5f5;
  border: 2px solid #fed7d7;
  border-radius: 12px;
}

.imagen-preview-failed .nombre-archivo {
  color: #e53e3e;
  font-weight: 500;
}

.preview-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.nombre-archivo {
  font-size: 0.875rem;
  color: #666;
  margin: 0.75rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-weight: 500;
}

/* PrimeVue FileUpload Customization */
:deep(.p-fileupload-buttonbar) {
  background-color: transparent !important;
  border: none;
  padding: 0;
  margin: 0;
}

:deep(.p-fileupload-content) {
  background-color: transparent !important;
  border: none;
  padding: 0;
}

:deep(.p-button) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  border: none;
  border-radius: 10px !important;
  padding: 0.875rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(30, 77, 43, 0.2);
}

:deep(.p-button:hover) {
  background: linear-gradient(135deg, #2d6b3f 0%, #1e4d2b 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 77, 43, 0.3);
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(30, 77, 43, 0.4);
}

:deep(.p-fileupload-choose) {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #1e4d2b !important;
  border-radius: 10px !important;
  background: rgba(30, 77, 43, 0.05) !important;
  color: #1e4d2b !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.p-fileupload-choose:hover) {
  background: rgba(30, 77, 43, 0.1) !important;
  border-style: solid !important;
}

:deep(.p-button.p-component.p-button-secondary) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  border: 2px solid #1e4d2b !important;
  color: #1e4d2b !important;
}

:deep(.p-button.p-component.p-button-secondary:hover) {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
}

:deep(.imagen-cargada .p-fileupload-choose) {
  background: rgba(30, 77, 43, 0.15) !important;
  border: 2px solid #1e4d2b !important;
  color: #1e4d2b !important;
}

.datos-vehiculo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
  position: relative;
}

.campo-formulario label {
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1e4d2b;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.campo-formulario label::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

.campo-formulario small {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.campo-formulario small.p-error {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.field-help {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.select-container {
  position: relative;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.custom-select:hover {
  border-color: #1e4d2b;
  box-shadow: 0 2px 8px rgba(30, 77, 43, 0.1);
}

.custom-select:focus {
  outline: none;
  border-color: #1e4d2b;
  box-shadow: 0 0 0 3px rgba(30, 77, 43, 0.1);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  transition: transform 0.2s ease;
}

.select-arrow i {
  font-size: 1rem;
}

.custom-select:focus + .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

.custom-select option {
  padding: 0.75rem;
  background: white;
  color: #333;
}

:deep(.p-input-custom),
:deep(.p-inputtext) {
  width: 100%;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.p-input-custom:hover),
:deep(.p-inputtext:hover) {
  border-color: #1e4d2b;
  box-shadow: 0 2px 8px rgba(30, 77, 43, 0.1);
}

:deep(.p-input-custom:focus),
:deep(.p-inputtext:focus) {
  outline: 0 none;
  border-color: #1e4d2b;
  box-shadow: 0 0 0 3px rgba(30, 77, 43, 0.1);
}

:deep(.p-input-custom.p-invalid),
:deep(.p-inputtext.p-invalid) {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .vehicle-spec-container {
    padding: 1.5rem;
  }
  
  .datos-vehiculo {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.5rem;
  }
  
  .foto-upload {
    min-height: 280px;
  }
  
  .upload-content {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .vehicle-spec-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .seccion {
    margin-bottom: 2rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.375rem;
    margin-bottom: 1.25rem;
  }
  
  .datos-vehiculo {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .foto-upload {
    min-height: 250px;
  }
  
  .upload-content {
    padding: 1.25rem 1rem;
    gap: 0.875rem;
  }
  
  .upload-header {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .preview-thumbnail {
    height: 180px;
  }
  
  :deep(.p-fileupload-choose) {
    height: 45px;
  }
  
  :deep(.p-button) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .vehicle-spec-container {
    padding: 0.75rem;
    margin: 0.25rem;
    border-radius: 12px;
  }
  
  .subtitulo-formulario {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .subtitulo-formulario::after {
    width: 60px;
    height: 2px;
  }
  
  .seccion {
    margin-bottom: 1.5rem;
  }
  
  .foto-upload {
    min-height: 220px;
  }
  
  .upload-content {
    padding: 1rem 0.75rem;
    gap: 0.75rem;
  }
  
  .upload-header {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .upload-hint {
    font-size: 0.8rem;
    padding: 0.5rem;
    margin: 0 0.5rem;
  }
  
  .preview-thumbnail {
    height: 150px;
  }
  
  .nombre-archivo {
    font-size: 0.8rem;
    margin: 0.5rem;
  }
  
  .campo-formulario label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  
  .campo-formulario small {
    font-size: 0.8rem;
  }
  
  :deep(.p-input-custom),
  :deep(.p-inputtext),
  .custom-select {
    padding: 0.75rem 0.875rem;
    font-size: 0.95rem;
  }
  
  :deep(.p-fileupload-choose) {
    height: 40px;
    font-size: 0.9rem;
  }
  
  :deep(.p-button) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .vehicle-spec-container {
    padding: 0.5rem;
  }
  
  .subtitulo-formulario {
    font-size: 1.125rem;
  }
  
  .foto-upload {
    min-height: 200px;
  }
  
  .upload-content {
    padding: 0.875rem 0.5rem;
  }
  
  .preview-thumbnail {
    height: 120px;
  }
  
  :deep(.p-input-custom),
  :deep(.p-inputtext),
  .custom-select {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
  }
  
  :deep(.p-button) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>