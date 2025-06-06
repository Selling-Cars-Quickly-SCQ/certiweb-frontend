<script setup>
import { ref, onMounted } from 'vue';
import HistoryItemComponent from './history-item/history-item.component.vue';
import FooterContentComponent from '@/public/components/footer-content.component.vue';
import { historyService } from '@/public/services/history.service.js';
import { userService } from '@/certifications/services/user.service.js';
import ToolbarComponent from '@/certifications/components/dashboard/toolbar/toolbar.component.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const reservations = ref([]);
const loading = ref(true);
const errorLoading = ref(null);

onMounted(async () => {
  try {
    const currentUser = await userService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      errorLoading.value = "No se pudo verificar el usuario. Por favor, inicie sesión.";
      loading.value = false;
      return;
    }

    const userReservations = await historyService.getReservationsByUserId(currentUser.id);
    
    reservations.value = userReservations.map((item, index) => ({ 
      ...item, 
      uniqueId: item.id || `reservation-${currentUser.id}-${index}` 
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
  background-color: #f4f4f4;
}

.history-container {
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1e4d2b;
  margin-bottom: 2rem;
  text-align: center;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #555;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.loading-state p,
.error-state p,
.empty-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.empty-state .p-button-outlined {
  margin-top: 1.5rem;
  color: #1e4d2b;
  border-color: #1e4d2b;
}

.empty-state .p-button-outlined:hover {
  background-color: rgba(30, 77, 43, 0.1);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  .history-list {
    justify-content: center;
  }
}
</style>