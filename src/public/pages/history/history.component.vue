<script setup>
import { ref, onMounted } from 'vue';
import HistoryItemComponent from './history-item/history-item.component.vue';
import FooterContentComponent from '@/public/components/footer-content.component.vue';
import { historyService } from '@/public/services/history.service.js';
import { userService } from '@/certifications/services/user.service.js';
import ToolbarComponent from '@/certifications/components/dashboard/toolbar/toolbar.component.vue';
import { useI18n } from 'vue-i18n';

const reservations = ref([]);
const loading = ref(true);
const errorLoading = ref(null);
const { t } = useI18n();

onMounted(async () => {
  try {
    const currentUser = await userService.getCurrentUser();
    
    console.log('Current user data:', currentUser);
    
    if (!currentUser || (!currentUser.id && !currentUser.userId)) {
      errorLoading.value = "No se pudo verificar el usuario. Por favor, inicie sesión.";
      loading.value = false;
      return;
    }

    const userId = currentUser.id || currentUser.userId;
    console.log('Using userId for filtering:', userId);
    
    const userReservations = await historyService.getReservationsByUserId(userId);
    
    console.log('Filtered reservations:', userReservations);
    
    reservations.value = userReservations.map((item, index) => ({ 
      ...item, 
      uniqueId: item.id || `reservation-${userId}-${index}` 
    }));

  } catch (err) {
    console.error("Error al cargar el historial de reservaciones:", err);
    errorLoading.value = "No se pudo cargar el historial. Inténtalo más tarde.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="history-page">
    <ToolbarComponent />
    <div class="history-container">
      <h1 class="page-title">{{ t('historyPage.title') }}</h1>

      <div v-if="loading" class="loading-state">
        <pv-progress-spinner strokeWidth="4" animationDuration=".5s" style="width: 50px; height: 50px;"/>
        <p>{{ t('historyPage.loading') }}</p>
      </div>
      
      <div v-else-if="errorLoading" class="error-state">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: red;"></i>
        <p>{{ errorLoading }}</p>
      </div>

      <div v-else-if="reservations.length > 0" class="history-list">
        <HistoryItemComponent
          v-for="reservation in reservations"
          :key="reservation.uniqueId"
          :reservation="reservation"
        />
      </div>

      <div v-else class="empty-state">
        <i class="pi pi-inbox" style="font-size: 2rem; color: #666;"></i>
        <p>{{ t('historyPage.emptyTitle') }}</p>
        <pv-button 
          :label="t('historyPage.exploreButton')" 
          icon="pi pi-search" 
          @click="$router.push('/')" 
          class="p-button-outlined"
        />
      </div>
    </div>
    <FooterContentComponent />
  </div>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.history-container {
  flex-grow: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  width: 100%;
}

.page-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #1e4d2b;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  letter-spacing: -0.025em;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6c757d;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.loading-state {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.error-state {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-color: rgba(220, 53, 69, 0.2);
}

.empty-state {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: rgba(59, 130, 246, 0.2);
}

.loading-state p,
.error-state p,
.empty-state p {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.5;
  max-width: 400px;
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 3rem !important;
  margin-bottom: 1rem;
}

.error-state i {
  color: #dc3545 !important;
}

.empty-state i {
  color: #3b82f6 !important;
}

.empty-state :deep(.p-button-outlined) {
  margin-top: 2rem;
  color: #1e4d2b;
  border-color: #1e4d2b;
  padding: 0.875rem 2rem;
  font-weight: 600;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(30, 77, 43, 0.2);
}

.empty-state :deep(.p-button-outlined:hover) {
  background: rgba(30, 77, 43, 0.1);
  border-color: #2d6b3f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .history-container {
    padding: 2rem 1.5rem;
  }
  
  .history-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

@media (max-width: 992px) {
  .history-container {
    padding: 1.5rem 1rem;
  }
  
  .history-list {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .page-title {
    font-size: 2.25rem;
    margin-bottom: 2rem;
  }
  
  .page-title::after {
    width: 100px;
    height: 3px;
  }
}

@media (max-width: 768px) {
  .history-container {
    padding: 1.25rem 1rem;
  }
  
  .history-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .page-title::after {
    width: 80px;
    height: 3px;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 3rem 1.5rem;
    margin: 1rem 0;
  }
  
  .loading-state p,
  .error-state p,
  .empty-state p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .history-container {
    padding: 1rem 0.75rem;
  }
  
  .history-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }
  
  .page-title::after {
    width: 60px;
    height: 2px;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2.5rem 1rem;
    border-radius: 12px;
  }
  
  .loading-state p,
  .error-state p,
  .empty-state p {
    font-size: 1rem;
    margin-top: 1.25rem;
  }
  
  .loading-state i,
  .error-state i,
  .empty-state i {
    font-size: 2.5rem !important;
  }
  
  .empty-state :deep(.p-button-outlined) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .history-container {
    padding: 0.75rem 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem 0.75rem;
  }
  
  .loading-state p,
  .error-state p,
  .empty-state p {
    font-size: 0.95rem;
  }
  
  .empty-state :deep(.p-button-outlined) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>