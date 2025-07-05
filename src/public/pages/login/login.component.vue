<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/public/services/auth.service';
import { useI18n } from 'vue-i18n';
import LanguageSwitcherComponent from '@/public/components/language-switcher/language-switcher.component.vue';

const router = useRouter();
const { t } = useI18n();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);

const validateForm = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos.';
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Por favor, introduce un correo electrónico válido.';
    return false;
  }
  
  errorMessage.value = '';
  return true;
};

const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    const userResult = await authService.login(email.value, password.value);
    
    if (userResult.success) {
      await handleSuccessfulLogin(userResult.user, false);
      return;
    }
    
    const adminResult = await authService.loginAdmin(email.value, password.value);
    
    if (adminResult.success) {
      await handleSuccessfulLogin(adminResult.user, true);
      return;
    }
    
    errorMessage.value = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
    
  } catch (error) {
    console.error('Error durante el login:', error);
    errorMessage.value = 'Error de conexión. Por favor, intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessfulLogin = async (user, isAdmin) => {
  successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo...';
  
  const sessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    isLoggedIn: true,
    isAdmin: isAdmin,
    lastLogin: new Date().toISOString()
  };
  
  localStorage.setItem('currentSession', JSON.stringify(sessionData));
  
  setTimeout(() => {
    if (isAdmin) {
      router.push('/admin-certification');
    } else {
      router.push('/');
    }
  }, 1500);
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <LanguageSwitcherComponent/>
  <div class="login-wrapper">
    <div class="login-container">
      <pv-card class="login-card">
        <template #header>
          <div class="card-header">
            <h1 class="title">{{ t('loginPage.title') }}</h1>
            <p class="subtitle">{{ t('loginPage.subtitle') }}</p>
          </div>
        </template>
        
        <template #content>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-field">
              <label for="email">{{ t('loginPage.emailLabel') }}</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope"></i>
                <pv-inputText 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  class="w-full" 
                  :placeholder="t('loginPage.emailPlaceholder')" 
                />
              </span>
            </div>
            
            <div class="form-field">
              <label for="password">{{ t('loginPage.passwordLabel') }}</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-lock"></i>
                <pv-password 
                  id="password" 
                  v-model="password" 
                  toggleMask 
                  :feedback="false" 
                  class="w-full" 
                  :placeholder="t('loginPage.passwordPlaceholder')" 
                />
              </span>
            </div>
            
            <div class="form-options">
              <div class="remember-me">
                <pv-checkbox 
                  id="rememberMe" 
                  v-model="rememberMe" 
                  :binary="true" 
                  class="remember-checkbox"
                />
                <label for="rememberMe" class="remember-label">{{ t('loginPage.rememberMe') }}</label>
              </div>
              
              <a href="#" class="forgot-password">{{ t('loginPage.forgotPassword') }}</a>
            </div>
            
            <!-- Message Error or Success -->
            <pv-message v-if="errorMessage" severity="error" :closable="false" class="message-box">
              <i class="pi pi-exclamation-circle message-icon"></i>
              <span class="message-text">{{ errorMessage }}</span>
            </pv-message>
            
            <pv-message v-if="successMessage" severity="success" :closable="false" class="message-box">
              <i class="pi pi-check-circle message-icon"></i>
              <span class="message-text">{{ successMessage }}</span>
            </pv-message>
            
            <div class="form-actions">
              <pv-button 
                type="submit" 
                :label="isLoading ? 'Iniciando sesión...' : t('loginPage.loginButton')" 
                icon="pi pi-sign-in" 
                class="p-button-primary login-button"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
            
            <div class="register-prompt">
              <p>{{ t('loginPage.noAccountPrompt') }}</p>
              <pv-button 
                type="button" 
                :label="t('loginPage.registerButton')" 
                class="p-button-text register-link" 
                @click="goToRegister"
              />
            </div>
          </form>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f0e1 0%, #ede4d1 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
}

.login-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

:deep(.login-card) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
  border: none;
  backdrop-filter: blur(10px);
}

:deep(.login-card .p-card-header) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
}

:deep(.login-card .p-card-header::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  pointer-events: none;
}

.card-header {
  position: relative;
  z-index: 1;
}

.card-header .title {
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header .subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.5;
}

:deep(.login-card .p-card-content) {
  padding: 0;
}

.login-form {
  padding: 2.5rem 2rem;
}

.form-field {
  margin-bottom: 1.75rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

:deep(.p-inputtext) {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-inputtext:hover) {
  border-color: #d1d5db;
  background-color: #ffffff;
}

:deep(.p-inputtext:focus) {
  border-color: #1e4d2b;
  box-shadow: 0 0 0 3px rgba(30, 77, 43, 0.1);
  background-color: #ffffff;
  outline: none;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-input-icon-left) {
  width: 100%;
}

:deep(.p-input-icon-left i) {
  color: #6b7280;
  left: 1rem;
  font-size: 1.1rem;
}

:deep(.p-input-icon-left input) {
  padding-left: 3rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.remember-checkbox) {
  margin-right: 0;
}

.remember-label {
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
}

.forgot-password {
  font-size: 0.9rem;
  color: #1e4d2b;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.forgot-password:hover {
  color: #2d6b3f;
  background-color: rgba(30, 77, 43, 0.05);
}

/* Messages */
:deep(.message-box) {
  margin: 1.75rem 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.message-box .p-message-wrapper) {
  padding: 1.25rem;
  width: 100%;
}

.message-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.message-text {
  font-weight: 500;
  line-height: 1.5;
}

/* Action Buttons */
.form-actions {
  margin-top: 2rem;
}

:deep(.login-button) {
  width: 100%;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 700;
  font-size: 1.05rem;
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  border-color: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.3);
  letter-spacing: 0.025em;
}

:deep(.login-button:hover) {
  background: linear-gradient(135deg, #2d6b3f 0%, #1e4d2b 100%);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(30, 77, 43, 0.4);
  transform: translateY(-2px);
}

:deep(.login-button:active) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.3);
}

.register-prompt {
  margin-top: 2.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.register-prompt p {
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

:deep(.register-link) {
  color: #1e4d2b;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.register-link:hover) {
  background-color: rgba(30, 77, 43, 0.1);
  color: #1e4d2b;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-wrapper {
    padding: 1rem 0.5rem;
  }
  
  .login-container {
    max-width: 100%;
  }
  
  :deep(.login-card .p-card-header) {
    padding: 2.5rem 1.5rem;
  }
  
  .card-header .title {
    font-size: 2.25rem;
  }
  
  .card-header .subtitle {
    font-size: 1rem;
  }
  
  .login-form {
    padding: 2rem 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 0.5rem;
  }
  
  :deep(.login-card) {
    border-radius: 16px;
  }
  
  :deep(.login-card .p-card-header) {
    padding: 2rem 1rem;
  }
  
  .card-header .title {
    font-size: 2rem;
  }
  
  .card-header .subtitle {
    font-size: 0.95rem;
  }
  
  .login-form {
    padding: 1.5rem 1rem;
  }
  
  .form-field {
    margin-bottom: 1.5rem;
  }
  
  :deep(.p-inputtext) {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
  
  :deep(.p-input-icon-left input) {
    padding-left: 2.75rem;
  }
  
  :deep(.login-button) {
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  :deep(.login-card .p-card-header) {
    padding: 1.5rem 0.75rem;
  }
  
  .card-header .title {
    font-size: 1.75rem;
  }
  
  .login-form {
    padding: 1.25rem 0.75rem;
  }
  
  :deep(.p-inputtext) {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
  }
  
  .remember-label,
  .forgot-password {
    font-size: 0.85rem;
  }
}

.w-full {
  width: 100%;
}
</style>