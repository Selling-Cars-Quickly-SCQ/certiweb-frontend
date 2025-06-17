<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const certifiedCars = ref([
  {
    id: 1,
    name: 'BMW Serie 4',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYVcLx4pGvnOpKwlHUU49s8jkRkJDGVxaiDw&s',
    color: t('carColors.metallicBlue'),
    price: 'S/4,399.00',
    route: '/car-detail/4'
  },
  {
    id: 2,
    name: 'Ford Mustang GT',
    image: 'https://www.vdm.ford.com/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_200A_PJS_883_89W_13B_COU_64F_99H_44U_EBST_YZTAC_DEFAULT_EXT_4.png',
    color: t('carColors.gray'),
    price: 'S/4,599.00',
    route: '/car-detail/5'
  },
  {
    id: 3,
    name: 'Kia Niro',
    image: 'https://cdn.motor1.com/images/mgl/ojyBzq/s3/kia-niro-2025.jpg',
    color: t('carColors.red'),
    price: 'S/3,900.00',
    route: '/car-detail/2'
  },
  {
    id: 4,
    name: 'Kia Sportage',
    image: 'https://s3.amazonaws.com/kia-greccomotors/Sportage_blanca_01_9a1ad740c7.png',
    color: t('carColors.pearlWhite'),
    price: 'S/3,299.00',
    route: '/car-detail/3'
  },
  {
    id: 5,
    name: 'Audi A5 Sportback',
    image: 'https://hips.hearstapps.com/hmg-prod/images/2025-audi-a5-137-669583e0eda6e.jpg?crop=0.638xw:0.479xh;0.207xw,0.312xh&resize=1200:*',
    color: t('carColors.quantumGray'),
    price: 'S/4,799.00',
    route: '/car-detail/6'
  },
  {
    id: 6,
    name: 'Mercedes Clase C',
    image: 'https://images.coches.com/_vn_/mercedes/Clase-C/0b325a581bbefb9994d94efc91277ba9.jpg?w=1920&ar=16:9',
    color: t('carColors.iridiumSilver'),
    price: 'S/4,670.00',
    route: '/car-detail/7'
  }
]);

const currentIndex = ref(0);
const visibleItems = ref(4);
const autoplayInterval = ref(null);
const isHovering = ref(false);

const navigateToCar = (route) => {
  router.push(route);
};

const nextSlide = () => {
  if (currentIndex.value < certifiedCars.value.length - visibleItems.value) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = certifiedCars.value.length - visibleItems.value;
  }
};

const adjustVisibleItems = () => {
  if (window.innerWidth < 640) {
    visibleItems.value = 1;
  } else if (window.innerWidth < 1024) {
    visibleItems.value = 2;
  } else if (window.innerWidth < 1280) {
    visibleItems.value = 3;
  } else {
    visibleItems.value = 4;
  }
};

const startAutoplay = () => {
  if (!autoplayInterval.value && !isHovering.value) {
    autoplayInterval.value = setInterval(() => {
      nextSlide();
    }, 5000);
  }
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const handleMouseEnter = () => {
  isHovering.value = true;
  stopAutoplay();
};

const handleMouseLeave = () => {
  isHovering.value = false;
  startAutoplay();
};

onMounted(() => {
  adjustVisibleItems();
  window.addEventListener('resize', adjustVisibleItems);
  startAutoplay();
  
  
  return () => {
    window.removeEventListener('resize', adjustVisibleItems);
    stopAutoplay();
  };
});
</script>

<template>
  <section class="certified-cars-section">
    <div class="certified-cars-container">
      <div class="certified-cars-header">
        <h2 class="welcome-title">{{ t('welcome.title') }}</h2>
        <p class="welcome-subtitle">{{ t('welcome.subtitle') }}</p>
      </div>
      
      <div 
        class="carousel-container" 
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave"
      >
        <pv-button 
          class="carousel-arrow carousel-arrow-prev" 
          @click="prevSlide"
          :class="{ 'disabled': currentIndex === 0 }"
        >
          <i class="pi pi-chevron-left"></i>
        </pv-button>
        
        <div class="carousel-wrapper">
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }"
          >
            <div 
              v-for="car in certifiedCars" 
              :key="car.id" 
              class="carousel-item"
              :style="{ width: `calc(${100 / visibleItems}% - 1rem)` }"
              @click="navigateToCar(car.route)"
            >
              <div class="car-card">
                <div class="car-image-container">
                  <img :src="car.image" :alt="car.name" class="car-image" />
                  <div class="car-overlay">
                    <span class="car-price">{{ car.price }}</span>
                    <span class="car-view-details">
                      <i class="pi pi-search"></i> {{ t('car.viewDetails') }}
                    </span>
                  </div>
                </div>
                <div class="car-info">
                  <h3 class="car-name">{{ car.name }}</h3>
                  <p class="car-color">{{ car.color }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <pv-button 
          class="carousel-arrow carousel-arrow-next" 
          @click="nextSlide"
          :class="{ 'disabled': currentIndex >= certifiedCars.length - visibleItems }"
        >
          <i class="pi pi-chevron-right"></i>
        </pv-button>
      </div>
      
      <div class="see-more-container">
        <router-link to="/cars" class="see-more-link">
          {{ t('navigation2.seeMoreModels') }}
          <i class="pi pi-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certified-cars-section {
  padding: 2rem 0.75rem;
  background-color: #f5f0e1;
}

.certified-cars-container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}

.certified-cars-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b4332;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 0.95rem;
  color: #495057;
  line-height: 1.5;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -0.5rem;
  padding: 1rem 0;
}

.carousel-wrapper {
  width: 100%;
  overflow: hidden;
  padding: 0 0.5rem;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex-shrink: 0;
  padding: 0 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carousel-item:hover {
  transform: translateY(-5px);
}

.car-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.car-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.car-image-container {
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 66.67%;
  flex-shrink: 0;
}

.car-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.car-card:hover .car-image {
  transform: scale(1.05);
}

.car-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 1.5rem 1rem 0.75rem;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.car-card:hover .car-overlay {
  opacity: 1;
  transform: translateY(0);
}

.car-price {
  font-weight: 700;
  font-size: 1.1rem;
}

.car-view-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.car-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.car-name {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 0.25rem;
  line-height: 1.3;
}

.car-color {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  color: #212529;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.carousel-arrow:hover {
  background-color: #f8f9fa;
  transform: translateY(-50%) scale(1.05);
}

.carousel-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-arrow.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-arrow-prev {
  left: 0.25rem;
}

.carousel-arrow-next {
  right: 0.25rem;
}

.carousel-arrow i {
  font-size: 1rem;
}

.see-more-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.see-more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #1b4332;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.see-more-link:hover {
  background-color: rgba(27, 67, 50, 0.1);
  transform: translateX(5px);
}

.see-more-link i {
  transition: transform 0.2s ease;
}

.see-more-link:hover i {
  transform: translateX(3px);
}

/* Responsive adjustments */
@media (min-width: 480px) {
  .certified-cars-section {
    padding: 2.5rem 1rem;
  }
  
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .carousel-arrow {
    width: 2.75rem;
    height: 2.75rem;
  }
  
  .carousel-arrow i {
    font-size: 1.1rem;
  }
  
  .carousel-arrow-prev {
    left: 0.5rem;
  }
  
  .carousel-arrow-next {
    right: 0.5rem;
  }
}

@media (min-width: 640px) {
  .certified-cars-header {
    text-align: left;
    padding-left: 1rem;
  }
  
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .car-name {
    font-size: 1.05rem;
  }
  
  .car-color {
    font-size: 0.9rem;
  }
  
  .car-price {
    font-size: 1.15rem;
  }
  
  .see-more-link {
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
  .certified-cars-section {
    padding: 3rem 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.9rem;
  }
  
  .welcome-subtitle {
    font-size: 1.05rem;
  }
  
  .carousel-arrow {
    width: 3rem;
    height: 3rem;
  }
  
  .carousel-arrow i {
    font-size: 1.2rem;
  }
  
  .carousel-arrow-prev {
    left: 0.75rem;
  }
  
  .carousel-arrow-next {
    right: 0.75rem;
  }
  
  .car-name {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .certified-cars-section {
    padding: 3.5rem 2rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
  
  .carousel-arrow-prev {
    left: -1rem;
  }
  
  .carousel-arrow-next {
    right: -1rem;
  }
}

/* Touch device optimizations */
@media (hover: none) {
  .car-overlay {
    opacity: 1;
    transform: translateY(0);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1), transparent);
  }
  
  .carousel-item:hover {
    transform: none;
  }
  
  .car-card:hover .car-image {
    transform: none;
  }
  
  .see-more-link:hover {
    transform: none;
  }
  
  .see-more-link:hover i {
    transform: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .carousel-track,
  .carousel-item,
  .car-card,
  .car-image,
  .car-overlay,
  .carousel-arrow,
  .see-more-link,
  .see-more-link i {
    transition: none !important;
    transform: none !important;
  }
}

/* Focus styles for keyboard navigation */
.carousel-arrow:focus-visible,
.see-more-link:focus-visible,
.carousel-item:focus-visible {
  outline: 2px solid #1b4332;
  outline-offset: 2px;
}
</style>