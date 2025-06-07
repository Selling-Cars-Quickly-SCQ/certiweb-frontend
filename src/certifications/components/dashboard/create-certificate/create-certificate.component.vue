<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const certificationRoute = '/reservation';

const bannerData = ref({
  carImage: 'https://img.freepik.com/foto-gratis/coche-lujoso-estacionado-carretera-faro-iluminado-al-atardecer_181624-60607.jpg?semt=ais_hybrid&w=740'
});

const navigateToCertification = () => {
  router.push(certificationRoute);
};
</script>

<template>
  <section class="certification-banner">
    <div class="certification-container">
      <div class="car-image-container">
        <img 
          :src="bannerData.carImage" 
          :alt="t('banner.carAltText')" 
          class="car-image"
        />
      </div>
      
      <div class="certification-content">
        <h2 class="certification-title">{{ t('banner.title') }}</h2>
        
        <p class="certification-description">
          {{ t('banner.description') }}
        </p>
        
        <div class="certification-action">
          <pv-button 
            class="certification-button" 
            @click="navigateToCertification"
          >
            <span>{{ t('banner.buttonText') }}</span>
            <i class="pi pi-arrow-right button-icon"></i>
          </pv-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certification-banner {
  width: 100%;
  background-color: #f5f0e1;
  padding: 1.5rem 1rem;
  overflow: hidden;
}

.certification-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.car-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  order: 1;
}

.car-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.car-image:hover {
  transform: scale(1.02);
}

.certification-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  order: 2;
  text-align: center;
}

.certification-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1b4332;
  margin: 0;
  line-height: 1.2;
}

.certification-description {
  font-size: 1rem;
  color: #495057;
  margin: 0;
  line-height: 1.5;
}

.certification-action {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
}

:deep(.certification-button) {
  background-color: #f9f871;
  border: none;
  color: #1b4332;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  justify-content: center;
}

:deep(.certification-button:hover) {
  background-color: #f5f38e;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

:deep(.certification-button:active) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-icon {
  transition: transform 0.2s ease;
}

:deep(.certification-button:hover) .button-icon {
  transform: translateX(4px);
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .certification-banner {
    padding: 2rem 1.5rem;
  }
  
  .certification-title {
    font-size: 2rem;
  }
  
  .certification-description {
    font-size: 1.05rem;
    max-width: 500px;
    margin: 0 auto;
  }
  
  :deep(.certification-button) {
    font-size: 1.05rem;
    padding: 0.75rem 1.5rem;
  }
}

@media (min-width: 768px) {
  .certification-container {
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  }
  
  .car-image-container {
    flex: 1;
    order: 2;
  }
  
  .certification-content {
    flex: 1;
    order: 1;
    text-align: left;
    justify-content: center;
  }
  
  .certification-action {
    justify-content: flex-start;
  }
  
  :deep(.certification-button) {
    width: auto;
  }
}

@media (min-width: 1024px) {
  .certification-banner {
    padding: 3rem 2rem;
  }
  
  .certification-container {
    gap: 3rem;
  }
  
  .certification-title {
    font-size: 2.25rem;
  }
  
  .certification-description {
    font-size: 1.1rem;
  }
  
  :deep(.certification-button) {
    font-size: 1.1rem;
    padding: 0.875rem 1.75rem;
  }
  
  .car-image {
    max-width: 600px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .car-image,
  .button-icon,
  :deep(.certification-button) {
    transition: none !important;
    transform: none !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .certification-title {
    color: #000;
  }
  
  .certification-description {
    color: #000;
  }
  
  :deep(.certification-button) {
    background-color: #fff;
    color: #000;
    border: 2px solid #000;
  }
}

/* Touch device optimizations */
@media (hover: none) {
  .car-image:hover {
    transform: none;
  }
  
  :deep(.certification-button:hover) {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.certification-button:hover) .button-icon {
    transform: none;
  }
}
</style>