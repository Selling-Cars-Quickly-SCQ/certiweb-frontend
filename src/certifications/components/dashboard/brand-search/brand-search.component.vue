<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const popularBrands = ref([
  {
    id: 1,
    name: 'Audi',
    logo: '/assets/brands/audi-logo.png', 
    searchRoute: '/busqueda/marca/audi'
  },
  {
    id: 2,
    name: 'Mercedes-Benz',
    logo: '/assets/brands/mercedes-logo.png', 
    searchRoute: '/busqueda/marca/mercedes'
  },
  {
    id: 3,
    name: 'BMW',
    logo: '/assets/brands/bmw-logo.png',
    searchRoute: '/busqueda/marca/bmw'
  },
  {
    id: 4,
    name: 'Volkswagen',
    logo: '/assets/brands/volkswagen-logo.png', 
    searchRoute: '/busqueda/marca/volkswagen'
  }
]);

const navigateToBrandSearch = (route) => {
  router.push(route);
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <section class="popular-brands-section">
    <div class="popular-brands-container">
      <h2 class="section-title">Marcas mas buscadas por los usuarios</h2>
      
      <div class="brands-grid">
        <div 
          v-for="brand in popularBrands" 
          :key="brand.id" 
          class="brand-item"
          @click="navigateToBrandSearch(brand.searchRoute)"
        >
          <div class="brand-logo-container">
            <img 
              :src="brand.logo" 
              :alt="`Logo de ${brand.name}`" 
              class="brand-logo"
              @error="$event.target.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100'"
            />
          </div>
          <span class="brand-name" v-if="brand.name === 'Audi'">{{ brand.name }}</span>
        </div>
      </div>
      
      <div class="back-to-home">
        <pv-button class="home-button" @click="goToHome">
          <i class="pi pi-chevron-up"></i>
          <span>Volver al inicio</span>
        </pv-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.popular-brands-section {
  width: 100%;
  background-color: #f5f0e1;
  padding: 3rem 1rem;
}

.popular-brands-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1b4332;
  margin-bottom: 2.5rem;
  text-align: center;
}

.brands-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2.5rem;
  width: 100%;
  margin-bottom: 2rem;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
}

.brand-item:hover {
  transform: translateY(-5px);
}

.brand-item::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 3px;
  background-color: #1b4332;
  transition: transform 0.3s ease;
  border-radius: 2px;
}

.brand-item:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.brand-logo-container {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.brand-item:hover .brand-logo {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #c41e3a;
  margin-top: 0.5rem;
}

.back-to-home {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.home-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: #1b4332;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.home-button:hover {
  background-color: rgba(27, 67, 50, 0.1);
}

.home-button i {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  transition: transform 0.3s ease;
}

.home-button:hover i {
  transform: translateY(-3px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .brands-grid {
    gap: 1.5rem;
  }
  
  .brand-logo-container {
    width: 100px;
    height: 100px;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 576px) {
  .popular-brands-section {
    padding: 2rem 1rem;
  }
  
  .brands-grid {
    gap: 1rem;
  }
  
  .brand-logo-container {
    width: 80px;
    height: 80px;
  }
  
  .brand-name {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
}
</style>