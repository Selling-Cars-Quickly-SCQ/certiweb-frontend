<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/certifications/services/user.service'
import toolbarComponent from '../../../certifications/components/dashboard/toolbar/toolbar.component.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const user = ref({
  name: '',
  email: '',
  plan: ''
});
const loading = ref(true);

onMounted(async () => {
  try {
    const userData = await userService.getCurrentUser();
    user.value = {
      name: userData.name || '',
      email: userData.email || '',
      plan: userData.plan || ''
    };
  } catch (e) {
    user.value = {
      name: 'No disponible',
      email: 'No disponible',
      plan: 'No disponible'
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <toolbarComponent/>
  <div class="profile-wrapper">
      <pv-card class="profile-card">
          <template #header>
              <h2 class="profile-title">{{ t('profilePage.title') }}</h2>
          </template>
          <template #content>
              <div v-if="loading" class="profile-loading">
                  {{ t('profilePage.loading') }}
              </div>
              <div v-else class="profile-data">
                  <div class="profile-row">
                      <span class="profile-label">{{ t('profilePage.nameLabel') }}:</span>
                      <span class="profile-value">{{ user.name }}</span>
                  </div>
                  <div class="profile-row">
                      <span class="profile-label">{{ t('profilePage.emailLabel') }}:</span>
                      <span class="profile-value">{{ user.email }}</span>
                  </div>
                  <div class="profile-row">
                      <span class="profile-label">{{ t('profilePage.planLabel') }}:</span>
                      <span class="profile-value">{{ user.plan }}</span>
                  </div>
              </div>
              <div class="back-home">
                  <pv-button 
                      :label="t('profilePage.backButton')" 
                      icon="pi pi-home" 
                      class="p-button-text home-btn"
                      @click="$router.push('/')" 
                  />
              </div>
          </template>
      </pv-card>
  </div>
</template>

<style scoped>
.profile-wrapper {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f0e1 0%, #ede4d1 100%);
  padding: 2rem 1rem;
  position: relative;
}

.profile-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

:deep(.profile-card) {
  width: 100%;
  max-width: 500px;
  border-radius: 1.25rem;
  box-shadow: 0 15px 35px rgba(30, 77, 43, 0.15);
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.profile-card .p-card-header) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  padding: 1.5rem;
  position: relative;
}

:deep(.profile-card .p-card-content) {
  padding: 1.5rem;
}

.profile-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-data {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid #1e4d2b;
  transition: all 0.3s ease;
}

.profile-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.profile-label {
  font-weight: 600;
  color: #1e4d2b;
  font-size: 1rem;
}

.profile-value {
  color: #495057;
  font-weight: 500;
  word-break: break-all;
  max-width: 60%;
  text-align: right;
}

.profile-loading {
  text-align: center;
  color: #1e4d2b;
  font-weight: 500;
  padding: 2rem;
  font-size: 1.1rem;
}

.back-home {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
}

:deep(.home-btn) {
  color: #1e4d2b;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-radius: 8px;
}

:deep(.home-btn:hover) {
  background-color: rgba(30, 77, 43, 0.1);
  color: #1e4d2b;
  transform: translateY(-1px);
}

:deep(.home-btn .p-button-icon) {
  font-size: 1.1rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .profile-wrapper {
    padding: 1.5rem 1rem;
    align-items: flex-start;
  }
  
  :deep(.profile-card) {
    max-width: 100%;
  }
  
  .profile-title {
    font-size: 1.5rem;
  }
  
  :deep(.profile-card .p-card-header) {
    padding: 1.25rem;
  }
  
  :deep(.profile-card .p-card-content) {
    padding: 1.25rem;
  }
}

@media (max-width: 576px) {
  .profile-wrapper {
    padding: 1rem 0.75rem;
    min-height: calc(100vh - 60px);
  }
  
  .profile-title {
    font-size: 1.35rem;
  }
  
  .profile-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.875rem;
  }
  
  .profile-value {
    max-width: 100%;
    text-align: left;
    font-size: 0.95rem;
  }
  
  .profile-label {
    font-size: 0.9rem;
    color: #64748b;
  }
  
  :deep(.profile-card .p-card-header) {
    padding: 1rem;
  }
  
  :deep(.profile-card .p-card-content) {
    padding: 1rem;
  }
  
  .back-home {
    justify-content: center;
  }
  
  :deep(.home-btn) {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 375px) {
  .profile-wrapper {
    padding: 0.75rem 0.5rem;
  }
  
  .profile-title {
    font-size: 1.25rem;
  }
  
  .profile-row {
    padding: 0.75rem;
  }
  
  .profile-loading {
    padding: 1.5rem;
    font-size: 1rem;
  }
  
  :deep(.profile-card .p-card-header) {
    padding: 0.875rem;
  }
  
  :deep(.profile-card .p-card-content) {
    padding: 0.875rem;
  }
}
</style>