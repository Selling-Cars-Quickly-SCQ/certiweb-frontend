<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const certificationRoute = '/certificacion';

const bannerData = ref({
  title: 'Sabemos que tu carro es importante',
  description: 'Certifica tu auto y obten una inspeccion que pondra mas valor y confiansa a la hora de venderlo.',
  buttonText: 'Obten tu certificado!',
  carImage: '/assets/kia-rio-red.jpg'
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
          alt="Kia Rio Rojo" 
          class="car-image"
          @error="$event.target.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=450'"
        />
      </div>
      
      <div class="certification-content">
        <h2 class="certification-title">{{ bannerData.title }}</h2>
        
        <p class="certification-description">
          {{ bannerData.description }}
        </p>
        
        <div class="certification-action">
          <pv-button 
            class="certification-button" 
            @click="navigateToCertification"
          >
            <span>{{ bannerData.buttonText }}</span>
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
  padding: 2rem 1rem;
  overflow: hidden;
}

.certification-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.car-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.car-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.car-image:hover {
  transform: scale(1.02);
}

.certification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.certification-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1b4332;
  margin: 0;
  line-height: 1.2;
}

.certification-description {
  font-size: 1.1rem;
  color: #495057;
  margin: 0;
  line-height: 1.6;
}

.certification-action {
  margin-top: 0.5rem;
}

:deep(.certification-button) {
  background-color: #f9f871;
  border: none;
  color: #1b4332;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
@media (max-width: 992px) {
  .certification-container {
    flex-direction: column;
    text-align: center;
  }
  
  .certification-title {
    font-size: 1.8rem;
  }
  
  .certification-description {
    font-size: 1rem;
  }
  
  .certification-action {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .certification-banner {
    padding: 1.5rem 1rem;
  }
  
  .certification-title {
    font-size: 1.5rem;
  }
  
  .car-image-container {
    margin-bottom: 1rem;
  }
}
</style>