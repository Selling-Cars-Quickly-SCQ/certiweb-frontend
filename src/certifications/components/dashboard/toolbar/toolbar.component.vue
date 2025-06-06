<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import certiwebLogo from '@/assets/certiweb.png';
import { userService } from '../../../services/user.service';
import languageSwitcherComponent from '../../../../public/components/language-switcher/language-switcher.component.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const userName = ref('Usuario');
const visible = ref(false);
const position = ref('topright');

onMounted(async () => {
  try {
    const userData = await userService.getCurrentUser();
    userName.value = userData.name || 'Usuario';
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    const sessionData = JSON.parse(localStorage.getItem('currentSession') || '{}');
    userName.value = sessionData.name || 'Usuario';
  }
});

const openMenu = () => {
  position.value = 'topright';
  visible.value = true;
};

const handleLogout = async () => {
  try {
    await userService.logout();
    visible.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const navigateTo = (route) => {
  router.push(route);
  visible.value = false;
};

const navigateToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="toolbar-container">
    <pv-toolbar class="custom-toolbar">
      <template #start>
        <div class="left-container">
          <div class="logo-container" @click="navigateToHome" style="cursor: pointer;">
            <img :src="certiwebLogo" alt="CertiWeb Logo" class="logo">
          </div>
          <div class="nav-links">
            <pv-button :label="t('toolbar.certifiedCars')" class="p-button-text nav-link" @click="navigateTo('/cars')"/>
            <pv-button :label="t('toolbar.certifyCar')" class="p-button-text nav-link" @click="navigateTo('/reservation')" />
          </div>
        </div>
      </template>

      <!-- Right side - User Name, Language Switcher and Menu -->
      <template #end>
        <div class="right-container">
          
          <div class="user-profile">
            <span class="user-name">{{ userName }}</span>
            <pv-button icon="pi pi-bars" class="p-button-text menu-button" @click="openMenu" :aria-label="t('toolbar.userMenu')" />
          </div>
        </div>
      </template>
    </pv-toolbar>
    
    <!-- Menu Dialog -->
    <pv-dialog 
      v-model:visible="visible" 
      :position="position" 
      :modal="true"
      :dismissableMask="true"
      :showHeader="false"
      :draggable="false"
      :resizable="false"
      class="menu-dialog"
      style="width: 300px; z-index: 9999;"
    >
      
      <div class="menu-header">
        <h3>{{ t('toolbar.menu') }}</h3>
        <pv-button icon="pi pi-times" class="p-button-text p-button-rounded close-button" @click="visible = false" />
      </div>
      <div class="menu-options">
        <div class="menu-option" @click="navigateTo('/profile')">
          <i class="pi pi-user"></i>
          <span>{{ t('toolbar.profile') }}</span>
        </div>
        <div class="menu-option" @click="navigateTo('/history')">
          <i class="pi pi-history"></i>
          <span>{{ t('toolbar.history') }}</span>
        </div>
        <div class="menu-option" @click="navigateTo('/support')">
          <i class="pi pi-question-circle"></i>
          <span>{{ t('toolbar.support') }}</span>
        </div>
        <div class="menu-option" @click="navigateTo('/terms-of-use')">
          <i class="pi pi-file"></i>
          <span>{{ t('toolbar.termsOfUse') }}</span>
        </div>
        <div class="menu-option logout-option" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
          <span>{{ t('toolbar.logout') }}</span>
        </div>
        <div>
          <language-switcher-component/>
        </div>
      </div>
    </pv-dialog>
  </div>
</template>

<style scoped>
.toolbar-container {
  width: 100%;
  position: relative;
}

.custom-toolbar {
  background-color: #1e4d2b !important;
  color: white !important;
  padding: 0 16px;
  height: 70px;
}

:deep(.p-toolbar) {
  background-color: #1e4d2b;
  border: none;
  padding: 0.5rem 1rem;
}

.left-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 50px; 
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.nav-links {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

:deep(.nav-link) {
  color: white !important;
  font-weight: 500;
  margin: 0 8px;
  text-transform: none;
  font-size: 14px;
  border: none;
  transition: all 0.2s ease;
}

:deep(.nav-link:hover) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px);
}

.user-profile {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  margin-left: auto;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: white;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

:deep(.menu-button) {
  color: white !important;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

:deep(.menu-button:hover) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.p-button-icon) {
  color: white !important;
}

/* Menu Dialog */
:deep(.menu-dialog) {
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background: #fff !important;
  z-index: 9999 !important;
}

:deep(.menu-dialog .p-dialog-content) {
  padding: 0;
  border-radius: 12px;
  background: #fff !important;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  z-index: 10001;
}

.menu-header h3 {
  margin: 0;
  color: #1e4d2b;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  z-index: 10002;
}

:deep(.close-button) {
  color: #666 !important;
}

.menu-options {
  padding: 8px 0;
  background: #fff;
  z-index: 10000;
}

.menu-option {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-option:hover {
  background-color: #f5f5f5;
  transform: translateX(4px);
}

.menu-option i {
  margin-right: 12px;
  font-size: 18px;
  color: #1e4d2b;
  width: 24px;
  text-align: center;
}

.menu-option span {
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.logout-option {
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
  padding-top: 14px;
}

.logout-option i,
.logout-option span {
  color: #e53935;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .nav-links {
    display: flex;
    flex-wrap: wrap;
  }
  
  :deep(.nav-link) {
    font-size: 13px;
    padding: 0.4rem 0.6rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .user-name {
    max-width: 100px;
  }
}
</style>