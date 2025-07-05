<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter()

const hoveredBrand = ref(null)

const popularBrands = ref([
  {
    id: 1,
    name: 'Audi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
    searchRoute: '/cars?brand=Audi',
    color: '#BB0A30'
  },
  {
    id: 2,
    name: 'Mercedes-Benz',
    logo: 'https://www.pngarts.com/files/3/Mercedes-Benz-Logo-PNG-Photo.png',
    searchRoute: '/cars?brand=Mercedes-Benz',
    color: '#00ADEF'
  },
  {
    id: 3,
    name: 'BMW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    searchRoute: '/cars?brand=BMW',
    color: '#0066B2'
  },
  {
    id: 4,
    name: 'Volkswagen',
    logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-10.svg',
    searchRoute: '/cars?brand=Volkswagen',
    color: '#001E50'
  }
])

const navigateToBrandSearch = (route) => {
  router.push(route)
}

const goToHome = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

const setHoveredBrand = (brandId) => {
  hoveredBrand.value = brandId
}

const clearHoveredBrand = () => {
  hoveredBrand.value = null
}
</script>

<template>
  <section class="brand-search-section">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h2 class="title">{{ t('brandSearch.title') }}</h2>
        <p class="subtitle">
          {{ t('brandSearch.subtitle') }}
        </p>
      </div>

      <!-- Brands Grid -->
      <div class="brands-grid">
        <pv-card
          v-for="brand in popularBrands"
          :key="brand.id"
          class="brand-card"
          @click="navigateToBrandSearch(brand.searchRoute)"
          @mouseenter="setHoveredBrand(brand.id)"
          @mouseleave="clearHoveredBrand"
        >
          <template #content>
            <div class="brand-content">
              <!-- Logo Container -->
              <div class="logo-container">
                <div 
                  class="logo-circle"
                  :style="{
                    background: hoveredBrand === brand.id
                      ? `linear-gradient(135deg, ${brand.color}15, ${brand.color}25)`
                      : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
                  }"
                >
                  <img
                    :src="brand.logo"
                    :alt="t('brandCard.logoAlt', { brand: brand.name })"
                    class="brand-logo"
                    @error="$event.target.src = '/placeholder.svg?height=80&width=80'"
                  />
                </div>

                <!-- Decorative ring -->
                <div
                  class="decorative-ring"
                  :class="{ active: hoveredBrand === brand.id }"
                  :style="{ borderColor: brand.color }"
                />
              </div>

              <!-- Brand Name -->
              <div class="brand-info">
                <h3
                  class="brand-name"
                  :style="{
                    color: hoveredBrand === brand.id ? brand.color : '#1e293b'
                  }"
                >
                  {{ brand.name }}
                </h3>

                <!-- Search indicator -->
                <div class="search-indicator">
                  <i class="pi pi-search"></i>
                  <span>{{ t('brandCard.viewVehicles') }}</span>
                </div>
              </div>

              <!-- Hover effect bar -->
              <div
                class="hover-bar"
                :class="{ active: hoveredBrand === brand.id }"
                :style="{ backgroundColor: brand.color }"
              />
            </div>
          </template>
        </pv-card>
      </div>

      <!-- Back to Home Button -->
      <div class="back-home">
        <pv-button
          @click="goToHome" 
          class="home-button"
          outlined
          size="large"
        >
          <i class="pi pi-chevron-up"></i>
          <span>{{ t('navigation.backToHome') }}</span>
        </pv-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brand-search-section {
  width: 100%;
  padding: 4rem 1rem;
  min-height: 60vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 32rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Brands Grid */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.brand-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.brand-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.brand-content {
  padding: 2rem;
  text-align: center;
  position: relative;
}

/* Logo Styles */
.logo-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.logo-circle {
  width: 8rem;
  height: 8rem;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.brand-card:hover .logo-circle {
  transform: scale(1.1);
}

.brand-logo {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

.brand-card:hover .brand-logo {
  transform: scale(1.1);
}

.decorative-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  opacity: 0;
}

.decorative-ring.active {
  opacity: 1;
  transform: scale(1.05);
}

/* Brand Info */
.brand-info {
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.search-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  transition: color 0.3s ease;
}

.brand-card:hover .search-indicator {
  color: #475569;
}

.search-indicator i {
  font-size: 1rem;
}

/* Hover Bar */
.hover-bar {
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform: scaleX(0);
  transform-origin: center;
}

.hover-bar.active {
  transform: scaleX(1);
}

/* Back Home Button - FIXED */
.back-home {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
}

.home-button {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid #e2e8f0 !important;
  color: #1e293b !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.home-button:hover {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) !important;
}

.home-button i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
  transform: rotate(-90deg);
}

.home-button:hover i {
  transform: translateY(-3px) rotate(-90deg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-search-section {
    padding: 2rem 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .brands-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .brand-content {
    padding: 1.5rem;
  }
  
  .logo-circle {
    width: 6rem;
    height: 6rem;
  }
  
  .brand-logo {
    width: 4rem;
    height: 4rem;
  }
}

@media (max-width: 480px) {
  .brands-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .brand-content {
    padding: 1rem;
  }
  
  .logo-circle {
    width: 5rem;
    height: 5rem;
  }
  
  .brand-logo {
    width: 3rem;
    height: 3rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
}

/* PrimeVue Card Override */
:deep(.p-card-content) {
  padding: 0 !important;
}

:deep(.p-card-body) {
  padding: 0 !important;
}

@media (max-width: 639px) {
  .brand-search-section {
    padding: 2rem 0.75rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .brands-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .brand-content {
    padding: 1.25rem 1rem;
  }
  
  .hover-bar {
    height: 2px;
  }
}

/* PrimeVue Card Override */
:deep(.p-card-content) {
  padding: 0 !important;
}

:deep(.p-card-body) {
  padding: 0 !important;
  height: 100%;
}

/* Responsive Design */
@media (min-width: 640px) {
  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .brand-content {
    padding: 1.75rem 1.25rem;
  }
  
  .logo-circle {
    width: 6rem;
    height: 6rem;
  }
  
  .brand-logo {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .brand-name {
    font-size: 1.15rem;
  }
}

@media (min-width: 768px) {
  .brand-search-section {
    padding: 3.5rem 1.5rem;
  }
  
  .title {
    font-size: 2.25rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .brands-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }
  
  .logo-circle {
    width: 7rem;
    height: 7rem;
  }
  
  .brand-logo {
    width: 4rem;
    height: 4rem;
  }
}

@media (min-width: 1024px) {
  .brand-search-section {
    padding: 4rem 2rem;
  }
  
  .brands-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .logo-circle {
    width: 8rem;
    height: 8rem;
  }
  
  .brand-logo {
    width: 5rem;
    height: 5rem;
  }
  
  .brand-name {
    font-size: 1.25rem;
  }
  
  .search-indicator {
    font-size: 0.875rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .brand-card,
  .logo-circle,
  .brand-logo,
  .decorative-ring,
  .hover-bar,
  .home-button,
  .home-button i {
    transition: none !important;
    transform: none !important;
  }
}

/* Touch device optimizations */
@media (hover: none) {
  .brand-card:hover {
    transform: none;
  }
  
  .hover-bar {
    transform: scaleX(1);
    opacity: 0.5;
  }
  
  .decorative-ring {
    opacity: 0.3;
  }
}
</style>