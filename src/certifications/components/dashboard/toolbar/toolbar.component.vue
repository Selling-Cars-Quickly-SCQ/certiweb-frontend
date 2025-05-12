<script setup>
import certiwebLogo from '@/assets/certiweb.png'

</script>

<template>
    <div class="toolbar-container">
      <pv-toolbar class="custom-toolbar">
        <!-- Left side - Logo -->
        <template #start>
          <div class="logo-container">
            <img :src="certiwebLogo" alt="CertiWeb Logo" class="logo">
          </div>
        </template>
  
        <!-- Center - Navigation Links -->
        <template #center>
          <div class="nav-links">
            <pv-button label="Nuevos autos" class="p-button-text nav-link" />
            <pv-button label="Autos Certificados en venta" class="p-button-text nav-link" />
            <pv-button label="Certifica tu auto" class="p-button-text nav-link" />
            <pv-button label="Guardados" class="p-button-text nav-link" />
          </div>
        </template>
  
        <!-- Right side - User Profile and Menu -->
        <template #end>
          <div class="user-profile">
            <pv-avatar image="https://randomuser.me/api/portraits/men/1.jpg" shape="circle" />
            <span class="user-name">Carlos M.</span>
          </div>
          <pv-button icon="pi pi-bars" class="p-button-text menu-button" />
        </template>
      </pv-toolbar>
    </div>
</template>
  

<style scoped>
.toolbar-container {
  width: 100%;
}

.custom-toolbar {
  background-color: #1e4d2b !important;
  color: white !important;
  padding: 0 16px;
}

:deep(.p-toolbar) {
  background-color: #1e4d2b;
  border: none;
  padding: 0.5rem 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 24px;
  justify-content: flex-start; /* Asegura alineación a la izquierda */
  flex: 1 0 auto; /* Permite que ocupe el espacio necesario a la izquierda */
}

.logo {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.nav-links {
  display: flex;
  align-items: center;
}

:deep(.nav-link) {
  color: white !important;
  font-weight: 500;
  margin: 0 8px;
  text-transform: none;
  font-size: 14px;
  border: none;
}

:deep(.nav-link:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.user-name {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

:deep(.menu-button) {
  color: white !important;
}

:deep(.p-button-icon) {
  color: white !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .nav-links {
    display: none;
  }
}
</style>