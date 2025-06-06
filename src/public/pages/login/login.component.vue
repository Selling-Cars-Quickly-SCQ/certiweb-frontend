<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { environment } from '@/environments/environment.development';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const rememberMe = ref(false);

const loadUsersFromDB = async () => {
  try {
    const responseUsers = await axios.get(`${environment.serverBasePath}/users`);
    const responseAdminUsers = await axios.get(`${environment.serverBasePath}/admin_user`);
    const dbUsers = responseUsers.data;
    const dbAdminUsers = responseAdminUsers.data;
    
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const localAdminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    
    const emails = new Set(localUsers.map(user => user.email));
    const combinedUsers = [...localUsers];
    
    dbUsers.forEach(dbUser => {
      if (!emails.has(dbUser.email)) {
        combinedUsers.push(dbUser);
        emails.add(dbUser.email);
      }
    });
    localStorage.setItem('users', JSON.stringify(combinedUsers));

    const adminEmails = new Set(localAdminUsers.map(user => user.email));
    const combinedAdminUsers = [...localAdminUsers];
    dbAdminUsers.forEach(dbAdminUser => {
      if (!adminEmails.has(dbAdminUser.email)) {
        combinedAdminUsers.push(dbAdminUser);
        adminEmails.add(dbAdminUser.email);
      }
    });
    localStorage.setItem('admin_users', JSON.stringify(combinedAdminUsers));
    
    return { users: combinedUsers, admins: combinedAdminUsers };
  } catch (error) {
    console.error('Error al cargar usuarios desde db.json:', error);
    return {
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      admins: JSON.parse(localStorage.getItem('admin_users') || '[]')
    };
  }
};

onMounted(async () => {
  await loadUsersFromDB();
});

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
  
  const { users, admins } = await loadUsersFromDB();
  
  let user = users.find(u => u.email === email.value);
  let isAdmin = false;

  if (user && user.password === password.value) {
    isAdmin = false;
  } else {
    user = admins.find(u => u.email === email.value);
    if (user && user.password === password.value) {
      isAdmin = true;
    } else {
      errorMessage.value = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
      return;
    }
  }
  
  successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo...';
  
  const sessionData = {
    userId: user.id || Date.now(),
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
                :label="t('loginPage.loginButton')" 
                icon="pi pi-sign-in" 
                class="p-button-primary login-button" 
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
  background: linear-gradient(135deg, #f5f0e1 0%, #f5f0e1 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
}

.login-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

:deep(.login-card) {
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
  border: none;
}

:deep(.login-card .p-card-header) {
  background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
  padding: 2.5rem 2rem;
  text-align: center;
}

.card-header .title {
  color: white;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.card-header .subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
}

:deep(.login-card .p-card-content) {
  padding: 0;
}

.login-form {
  padding: 2rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  font-size: 0.95rem;
}

:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

:deep(.p-inputtext:hover) {
  border-color: #94a3b8;
}

:deep(.p-inputtext:focus) {
  border-color: #1e4d2b;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  background-color: #ffffff;
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
  color: #64748b;
  left: 0.75rem;
}

:deep(.p-input-icon-left input) {
  padding-left: 2.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

:deep(.remember-checkbox) {
  margin-right: 0.5rem;
}

.remember-label {
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
}

.forgot-password {
  font-size: 0.9rem;
  color: #1e4d2b;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Messages */
:deep(.message-box) {
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
}

:deep(.message-box .p-message-wrapper) {
  padding: 1rem;
}

.message-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.message-text {
  font-weight: 500;
}

/* Action Buttons */
.form-actions {
  margin-top: 1.5rem;
}

:deep(.login-button) {
  width: 100%;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
  border-color: transparent;
  transition: all 0.3s ease;
}

:deep(.login-button:hover) {
  background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
  border-color: transparent;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.register-prompt {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-prompt p {
  color: #64748b;
  margin-bottom: 0.5rem;
}

:deep(.register-link) {
  color: #1e4d2b;
  font-weight: 600;
}

:deep(.register-link:hover) {
  background-color: rgba(30, 77, 43, 0.1);
  color: #1e4d2b;
}

/* Responsive */
@media (max-width: 576px) {
  .login-wrapper {
    padding: 1rem 0;
  }
  
  .card-header .title {
    font-size: 1.75rem;
  }
  
  .login-form {
    padding: 1.5rem 1rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

.w-full {
  width: 100%;
}
</style>