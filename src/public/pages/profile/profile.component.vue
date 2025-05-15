<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/certifications/services/user.service'
import toolbarComponent from '../../../certifications/components/dashboard/toolbar/toolbar.component.vue'
const user = ref({
  name: '',
  email: '',
  plan: ''
})
const loading = ref(true)

onMounted(async () => {
  try {
    const userData = await userService.getCurrentUser()
    user.value = {
      name: userData.name || '',
      email: userData.email || '',
      plan: userData.plan || ''
    }
  } catch (e) {
    user.value = {
      name: 'No disponible',
      email: 'No disponible',
      plan: 'No disponible'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
    <toolbarComponent/>
  <div class="profile-wrapper">
    <pv-card class="profile-card">
      <template #header>
        <h2 class="profile-title">Perfil de Usuario</h2>
      </template>
      <template #content>
        <div v-if="loading" class="profile-loading">
          Cargando datos...
        </div>
        <div v-else class="profile-data">
          <div class="profile-row">
            <span class="profile-label">Nombre:</span>
            <span class="profile-value">{{ user.name }}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Correo:</span>
            <span class="profile-value">{{ user.email }}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Plan:</span>
            <span class="profile-value">{{ user.plan }}</span>
          </div>
        </div>
        <div class="back-home">
        <pv-button 
            label="Volver al inicio" 
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
  background: #f5f0e1;
}

.profile-card {
  width: 100%;
  max-width: 400px;
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(30, 77, 43, 0.10);
  background: #fff;
  padding: 1.5rem 1.5rem 2rem 1.5rem;
}

.profile-title {
  color: #1e4d2b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.profile-data {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-label {
  font-weight: 600;
  color: #1e4d2b;
}

.profile-value {
  color: #495057;
  font-weight: 400;
  word-break: break-all;
}

.profile-loading {
  text-align: center;
  color: #1e4d2b;
  font-weight: 500;
}
.back-home {
  
  
  justify-content: flex-start;
  margin-top: 2rem;
  margin-left: 10px;
}
.home-btn {
  color: #1e4d2b;
  font-weight: 600;
  font-size: 1rem;
}
</style>