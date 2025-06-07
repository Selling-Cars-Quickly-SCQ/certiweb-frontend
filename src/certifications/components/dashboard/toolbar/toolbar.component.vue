<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import certiwebLogo from '@/assets/certiweb.png';
import { userService } from '../../../services/user.service';
import languageSwitcherComponent from '../../../../public/components/language-switcher/language-switcher.component.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const userName = ref('Usuario');
const mobileMenuVisible = ref(false);
const { t } = useI18n();

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

watch(mobileMenuVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
});

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

const closeMobileMenu = () => {
  mobileMenuVisible.value = false;
};

const handleLogout = async () => {
  try {
    await userService.logout();
    mobileMenuVisible.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const navigateTo = (route) => {
  router.push(route);
  mobileMenuVisible.value = false;
};

const navigateToHome = () => {
  router.push('/');
  mobileMenuVisible.value = false;
};
</script>

<template>
  <div class="toolbar-container">
    <!-- Main Toolbar -->
    <nav class="main-toolbar">
      <!-- Left Section: Logo and Navigation -->
      <div class="toolbar-left">
        <div class="logo-section" @click="navigateToHome">
          <img :src="certiwebLogo" alt="CertiWeb Logo" class="logo">
          <span class="brand-name">CertiWeb</span>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <pv-button 
            :label="t('toolbar.certifiedCars')" 
            class="nav-button" 
            @click="navigateTo('/cars')"
            icon="pi pi-car"
          />
          <pv-button 
            :label="t('toolbar.certifyCar')" 
            class="nav-button" 
            @click="navigateTo('/reservation')"
            icon="pi pi-plus-circle"
          />
        </div>
      </div>

      <!-- Right Section: User Profile and Menu -->
      <div class="toolbar-right">
        <div class="desktop-language">
          <language-switcher-component/>
        </div>
        
        <!-- User Profile -->
        <div class="user-profile desktop-only">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
          </div>
        </div>

        <!-- Universal Menu Button -->
        <pv-button 
          class="menu-button" 
          @click="toggleMobileMenu"
          :aria-label="t('toolbar.menu')"
        >
          <i class="pi" :class="mobileMenuVisible ? 'pi-times' : 'pi-bars'"></i>
        </pv-button>
      </div>
    </nav>

    <!-- Universal Side Menu -->
    <div class="side-menu" :class="{ active: mobileMenuVisible }">
      <div class="side-menu-header">
        <div class="menu-user-info">
          <div class="menu-user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="menu-user-details">
            <span class="menu-user-name">{{ userName }}</span>
            <span class="menu-user-subtitle">{{ t('toolbar.menu') }}</span>
          </div>
        </div>
        <pv-button class="close-btn" @click="closeMobileMenu" aria-label="Cerrar menú">
          <i class="pi pi-times"></i>
        </pv-button>
      </div>
      
      <div class="side-menu-content">
        <!-- Navigation Links -->
        <div class="mobile-nav-section">
          <div class="menu-section-title">Navegación</div>
          <div class="menu-item" @click="navigateTo('/cars')">
            <div class="menu-item-icon">
              <i class="pi pi-car"></i>
            </div>
            <div class="menu-item-content">
              <span class="menu-item-title">{{ t('toolbar.certifiedCars') }}</span>
              <span class="menu-item-subtitle">Explora vehículos certificados</span>
            </div>
            <i class="pi pi-angle-right"></i>
          </div>
          <div class="menu-item" @click="navigateTo('/reservation')">
            <div class="menu-item-icon">
              <i class="pi pi-plus-circle"></i>
            </div>
            <div class="menu-item-content">
              <span class="menu-item-title">{{ t('toolbar.certifyCar') }}</span>
              <span class="menu-item-subtitle">Certifica tu vehículo</span>
            </div>
            <i class="pi pi-angle-right"></i>
          </div>
          <div class="menu-divider"></div>
        </div>

        <!-- User Options -->
        <div class="menu-section-title">Cuenta</div>
        <div class="menu-item" @click="navigateTo('/profile')">
          <div class="menu-item-icon">
            <i class="pi pi-user"></i>
          </div>
          <div class="menu-item-content">
            <span class="menu-item-title">{{ t('toolbar.profile') }}</span>
            <span class="menu-item-subtitle">Gestiona tu perfil</span>
          </div>
          <i class="pi pi-angle-right"></i>
        </div>
        
        <div class="menu-item" @click="navigateTo('/history')">
          <div class="menu-item-icon">
            <i class="pi pi-history"></i>
          </div>
          <div class="menu-item-content">
            <span class="menu-item-title">{{ t('toolbar.history') }}</span>
            <span class="menu-item-subtitle">Historial de actividades</span>
          </div>
          <i class="pi pi-angle-right"></i>
        </div>
        
        <div class="menu-item" @click="navigateTo('/support')">
          <div class="menu-item-icon">
            <i class="pi pi-question-circle"></i>
          </div>
          <div class="menu-item-content">
            <span class="menu-item-title">{{ t('toolbar.support') }}</span>
            <span class="menu-item-subtitle">Ayuda y soporte</span>
          </div>
          <i class="pi pi-angle-right"></i>
        </div>
        
        <div class="menu-item" @click="navigateTo('/terms-of-use')">
          <div class="menu-item-icon">
            <i class="pi pi-file"></i>
          </div>
          <div class="menu-item-content">
            <span class="menu-item-title">{{ t('toolbar.termsOfUse') }}</span>
            <span class="menu-item-subtitle">Términos y condiciones</span>
          </div>
          <i class="pi pi-angle-right"></i>
        </div>
        
        <div class="menu-divider"></div>
        
        <!-- Language Switcher -->
        <div class="language-section">
          <div class="menu-section-title">Idioma</div>
          <div class="language-wrapper">
            <language-switcher-component/>
          </div>
        </div>
        
        <div class="menu-divider"></div>
        
        <!-- Logout -->
        <div class="menu-item logout-item" @click="handleLogout">
          <div class="menu-item-icon logout-icon">
            <i class="pi pi-sign-out"></i>
          </div>
          <div class="menu-item-content">
            <span class="menu-item-title">{{ t('toolbar.logout') }}</span>
            <span class="menu-item-subtitle">Cerrar sesión</span>
          </div>
          <i class="pi pi-angle-right"></i>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div 
      class="overlay" 
      :class="{ active: mobileMenuVisible }" 
      @click="mobileMenuVisible = false"
    ></div>
  </div>
</template>

<style scoped>
.toolbar-container {
  width: 100%;
  position: relative;
  z-index: 1000;
}

/* Main Toolbar */
.main-toolbar {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d5a3d 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  position: relative;
}

/* Left Section */
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo {
  height: 48px;
  width: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.logo:hover {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.nav-button) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  padding: 0.75rem 1.25rem !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(10px) !important;
}

:deep(.nav-button:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

:deep(.nav-button .p-button-icon) {
  margin-right: 0.5rem !important;
}

/* Right Section */
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.desktop-language {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Universal Menu Button */
.menu-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.menu-button i {
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

/* Universal Side Menu */
.side-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 25px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 9998;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.side-menu.active {
  right: 0;
}

/* Side Menu Header */
.side-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e4d2b 0%, #2d5a3d 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.menu-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.menu-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.menu-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.menu-user-name {
  font-weight: 600;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-user-subtitle {
  font-size: 0.85rem;
  opacity: 0.8;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.close-btn i {
  font-size: 1.2rem;
}

/* Side Menu Content */
.side-menu-content {
  padding: 1.5rem 0;
  flex: 1;
  overflow-y: auto;
}

.menu-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.menu-section-title:first-child {
  margin-top: 0;
}

.mobile-nav-section {
  display: none;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background: #f8f9fa;
  border-left-color: #1e4d2b;
  transform: translateX(2px);
}

.menu-item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f0f7f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e4d2b;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.menu-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.menu-item-title {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.menu-item-subtitle {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
}

.menu-item > .pi-angle-right {
  color: #ccc;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.menu-divider {
  height: 1px;
  background: #e9ecef;
  margin: 1rem 1.5rem;
}

.language-section {
  margin: 0.5rem 0;
}

.language-wrapper {
  padding: 0 1.5rem;
  overflow: hidden;
}

.language-wrapper :deep(*) {
  max-width: 100%;
  box-sizing: border-box;
}

.logout-item {
  background: #fef7f7;
  border-top: 1px solid #fee;
}

.logout-item:hover {
  background: #fef0f0;
  border-left-color: #e53935;
}

.logout-icon {
  background: #ffebee !important;
  color: #e53935 !important;
}

.logout-item .menu-item-title,
.logout-item .menu-item-subtitle {
  color: #e53935;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 9997;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-toolbar {
    padding: 0.75rem 1rem;
  }
  
  .toolbar-left {
    gap: 1.5rem;
  }
  
  .brand-name {
    font-size: 1.3rem;
  }
  
  :deep(.nav-button) {
    padding: 0.6rem 1rem !important;
    font-size: 0.9rem !important;
  }
  
  .side-menu {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .main-toolbar {
    padding: 0.75rem 1rem;
  }
  
  .desktop-nav,
  .desktop-language,
  .desktop-only {
    display: none !important;
  }
  
  .mobile-nav-section {
    display: block !important;
  }
  
  .brand-name {
    font-size: 1.2rem;
  }
  
  .logo {
    height: 40px;
    width: 40px;
  }
  
  .side-menu {
    width: 100%;
  }
  
  .side-menu.active {
    right: 0;
    width: 100vw;
  }
}

@media (max-width: 480px) {
  .main-toolbar {
    padding: 0.5rem 0.75rem;
    min-height: 60px;
  }
  
  .toolbar-left {
    gap: 1rem;
  }
  
  .brand-name {
    font-size: 1.1rem;
  }
  
  .logo {
    height: 36px;
    width: 36px;
  }
  
  .menu-button {
    width: 44px;
    height: 44px;
  }
  
  .side-menu-header {
    padding: 1rem;
  }
  
  .menu-user-name {
    font-size: 1rem;
  }
}

* {
  -webkit-tap-highlight-color: transparent;
}

.main-toolbar,
.side-menu,
.menu-item,
.close-btn,
.menu-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-section:focus,
.menu-item:focus,
.close-btn:focus,
.menu-button:focus {
  outline: 2px solid rgba(30, 77, 43, 0.5);
  outline-offset: 2px;
}

body.menu-open {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}
</style>