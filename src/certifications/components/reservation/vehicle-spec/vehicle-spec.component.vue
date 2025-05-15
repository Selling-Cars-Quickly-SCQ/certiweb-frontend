<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { imgbbApiService } from '@/shared/services/imgbb-api.service';

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
  precioVender: null
});
const placaValida = ref(true);

const validarPlaca = (placa) => {
  const regex = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  return regex.test(placa);
};

const selectedOptions = ref();
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
  { nombre: 'Ford', codigo: 'ford' }
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
</script>

<template>
  <div class="vehicle-spec-container">
    <div class="seccion">
      <h2 class="subtitulo-formulario">SUBIR FOTO DEL VEHÍCULO</h2>
      <div class="fotos-container">
        <div class="foto-upload" :class="{ 'foto-uploaded': imagenCargada1 }">
          <div class="upload-header">Foto del Vehículo</div>
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
              chooseLabel="Seleccionar"
              :auto="false"
            />
            <pv-button label="Enviar imagen" @click="upload" severity="secondary" :disabled="cargandoImagen" />
          </div>
          <small class="upload-hint">* Solo JPG, máx. 1MB</small>
          <div v-if="imagenCargada1 && imagenUrl1" class="imagen-preview">
            <img :src="imagenUrl1" alt="Vista previa" class="preview-thumbnail" />
            <span class="nombre-archivo">{{ imagen1?.name }}</span>
          </div>
          <div v-else-if="imagen1 && !imagenCargada1 && !cargandoImagen" class="imagen-preview-failed">
            <span class="nombre-archivo">{{ imagen1?.name }} (Error al cargar)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="seccion">
      <h2 class="subtitulo-formulario">DATOS DEL VEHÍCULO</h2>
      <div class="datos-vehiculo">
        <div class="campo-formulario">
            <label for="marca">MARCA</label>
            <div class="select-container">
                <select 
                  id="marca"
                  v-model="formulario.marca" 
                  @change="updateFormData"
                  class="custom-select"
                >
                  <option value="" disabled selected>Seleccione una marca</option>
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
          <label for="modelo">MODELO</label>
          <pv-inputText
            id="modelo"
            v-model="formulario.modelo"
            placeholder="Ingrese el modelo"
            @input="updateFormData"
            class="p-input-custom"
          />
        </div>

        <div class="campo-formulario">
          <label for="placa">PLACA</label>
          <pv-inputText
            id="placa"
            v-model="formulario.placa"
            placeholder="Ej: A1E-45O"
            @input="formatearPlaca"
            maxlength="7"
            class="p-input-custom"
            :class="{ 'p-invalid': !placaValida && formulario.placa.length > 0 }"
          />
          <small class="field-help">Formato: 3 caracteres alfanuméricos - 3 caracteres alfanuméricos (Ej: ABC-123)</small>
          <small v-if="!placaValida && formulario.placa.length === 7" class="p-error">Formato de placa incorrecto. Use XXX-XXX (letras/números).</small>
          <small v-else-if="!placaValida && formulario.placa.length > 0 && formulario.placa.length < 7" class="p-error">Placa incompleta.</small>
        </div>

        <div class="campo-formulario">
          <label for="precio">PRECIO A VENDER</label>
          <pv-inputText
            id="precio"
            v-model="formulario.precioVender"
            placeholder="S/."
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
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
  font-family: 'Roboto', sans-serif;
}

.seccion {
  margin-bottom: 36px;
}

.subtitulo-formulario {
  color: #1e4d2b;
  font-size: 22px;
  margin-bottom: 18px;
  font-weight: 600;
  border-bottom: 2px solid #e1e1e1;
  padding-bottom: 12px;
  position: relative;
}

.subtitulo-formulario::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background-color: #1e4d2b;
}

.fotos-container {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 20px;
}

.foto-upload {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 250px;
}

.foto-upload:hover {
  border-color: #1e4d2b;
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.15);
}

.foto-uploaded {
  border-left: 4px solid #1e4d2b;
}

.upload-header {
  background-color: #f0f5f1;
  color: #1e4d2b;
  font-weight: 600;
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  text-align: center;
}

.upload-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.upload-hint {
  padding: 0 16px 10px;
  color: #666;
  font-size: 12px;
  text-align: center;
}

.imagen-preview {
  margin: 0 16px 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f5f1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.imagen-preview-failed {
  margin: 0 16px 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background-color: #fff0f0;
  border: 1px solid #d9534f;
  border-radius: 8px;
}

.imagen-preview-failed .nombre-archivo {
  color: #d9534f;
}

.preview-thumbnail {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid #e0e0e0;
}

.nombre-archivo {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  width: 90%;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  background-color: #1e4d2b;
  border-color: #1e4d2b;
  border-radius: 6px !important;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.p-button:hover) {
  background-color: #2a6a3c;
  border-color: #2a6a3c;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(30, 77, 43, 0.4);
}

:deep(.p-fileupload-choose) {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #1e4d2b !important;
  border-radius: 6px !important;
  background-color: rgba(30, 77, 43, 0.05) !important;
  color: #1e4d2b !important;
  font-weight: 500;
}

:deep(.p-fileupload-choose:hover) {
  background-color: rgba(30, 77, 43, 0.1) !important;
}

:deep(.p-button.p-component.p-button-secondary) {
  background-color: #f0f5f1 !important;
  border-color: #1e4d2b !important;
  color: #1e4d2b !important;
}

:deep(.p-button.p-component.p-button-secondary:hover) {
  background-color: #e0eae1 !important;
}

:deep(.imagen-cargada .p-fileupload-choose) {
  background-color: rgba(30, 77, 43, 0.1) !important;
  border: 1px solid #1e4d2b !important;
}

.datos-vehiculo {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
}

.campo-formulario label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e4d2b;
  font-size: 14px;
}

.campo-formulario small {
  margin-top: 6px;
  color: #666;
  font-size: 12px;
}

.campo-formulario small.p-error {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.field-help {
  color: #666;
  font-size: 12px;
  margin-top: 6px;
}

/* PrimeVue Select & Input Customization */
:deep(.p-select-custom) {
  width: 100%;
  background-color: #ffffff;
}

:deep(.p-select) {
  position: relative;
  width: 100%;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-select:hover {
  border-color: #1e4d2b;
}

.custom-select:focus {
  outline: none;
  border-color: #1e4d2b;
  box-shadow: 0 0 0 2px rgba(30, 77, 43, 0.2);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
}

.select-arrow i {
  font-size: 12px;
}

.custom-select option {
  padding: 10px;
  background-color: white;
  color: #333;
}

.custom-select option:hover,
.custom-select option:focus {
  background-color: #f0f5f1;
}

:deep(.p-select-item) {
  background-color: #ffffff !important;
  padding: 10px 16px !important;
  color: #374151 !important;
  font-size: 14px !important;
  transition: background-color 0.2s !important;
}

:deep(.p-select-item:hover) {
  background-color: rgba(30, 77, 43, 0.08) !important;
}

:deep(.p-select-item.p-highlight) {
  background-color: rgba(30, 77, 43, 0.15) !important;
  color: #1e4d2b !important;
  font-weight: 500 !important;
}

:deep(.p-select-trigger) {
  width: 40px;
  background-color: white;
  border-left: none;
  color: #666;
}

:deep(.p-select-label) {
  padding: 10px 16px;
  font-size: 14px;
}

:deep(.p-input-custom),
:deep(.p-inputtext) {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.p-input-custom:hover),
:deep(.p-inputtext:hover) {
  border-color: #1e4d2b;
}

:deep(.p-input-custom:focus),
:deep(.p-inputtext:focus) {
  outline: 0 none;
  border-color: #1e4d2b;
  box-shadow: 0 0 0 2px rgba(30, 77, 43, 0.2);
}

:deep(.p-input-custom.p-invalid),
:deep(.p-inputtext.p-invalid) {
  border-color: #f44336 !important;
}

/* Responsive */
@media (max-width: 992px) {
  .fotos-container {
    flex-direction: column;
  }

  .datos-vehiculo {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .vehicle-spec-container {
    padding: 16px;
  }
  
  .subtitulo-formulario {
    font-size: 20px;
  }
}
</style>
