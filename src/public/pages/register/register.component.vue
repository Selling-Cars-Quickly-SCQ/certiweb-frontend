<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerService } from '@/public/services/register.service.js';
const router = useRouter();

const currentStep = ref(0);
const items = ref([
    {
        label: 'Información Personal'
    },
    {
        label: 'Seleccionar Plan'
    },
    {
        label: 'Pago'
    }
]);

const name = ref('');
const email = ref('');
const password = ref('');

const planOptions = ref([
    { name: 'Mensual', value: 'Mensual' },
    { name: 'Anual', value: 'Anual' }
]);
const selectedPlan = ref(null);

// Payment Information
const cardNumber = ref('');
const expiryDate = ref('');
const cvv = ref('');

const errorMessage = ref('');
const successMessage = ref('');

const validateStep0 = () => {
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos de información personal.';
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

const validateStep1 = () => {
  if (!selectedPlan.value) {
    errorMessage.value = 'Por favor, selecciona un plan.';
    return false;
  }
  errorMessage.value = '';
  return true;
};

const nextStep = () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (currentStep.value === 0) {
    if (validateStep0()) {
      currentStep.value++;
    }
  } else if (currentStep.value === 1) {
    if (validateStep1()) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleRegistration = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Payment simulation
  if (!cardNumber.value || !expiryDate.value || !cvv.value) {
    errorMessage.value = 'Por favor, completa los datos de pago (simulación).';
    return;
  }

  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    plan: selectedPlan.value
  };

  try {
    await registerService.registerUser(userData);
    successMessage.value = '¡Registro exitoso! Serás redirigido al login.';
    name.value = '';
    email.value = '';
    password.value = '';
    selectedPlan.value = null;
    cardNumber.value = '';
    expiryDate.value = '';
    cvv.value = '';
    currentStep.value = 0;
    setTimeout(() => {
      // router.push('/login');
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Error al registrar. El correo podría ya estar en uso o el servidor no está disponible.';
  }
};

</script>

<template>
    <div class="register-wrapper">
      <div class="register-container">
        <pv-card class="register-card">
          <template #header>
            <div class="card-header">
              <h1 class="title">Crear tu cuenta</h1>
              <p class="subtitle">Completa el formulario para acceder a CertiWeb</p>
            </div>
          </template>
          
          <template #content>
            <div class="steps-container">
              <pv-steps :model="items" :activeIndex="currentStep" class="custom-steps" :readonly="true"/>
            </div>
            
            <form @submit.prevent="currentStep === 2 ? handleRegistration() : nextStep()">
              <!-- Step 1: Personal Information -->
              <div v-if="currentStep === 0" class="step-content">
                <h2 class="step-title">Información Personal</h2>
                
                <div class="form-field">
                  <label for="name">Nombre Completo</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-user"></i>
                    <pv-inputText id="name" v-model="name" type="text" class="w-full" placeholder="Ingresa tu nombre completo" />
                  </span>
                </div>
                
                <div class="form-field">
                  <label for="email">Correo Electrónico</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-envelope"></i>
                    <pv-inputText id="email" v-model="email" type="email" class="w-full" placeholder="ejemplo@correo.com" />
                  </span>
                </div>
                
                <div class="form-field">
                  <label for="password">Contraseña</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-lock"></i>
                    <pv-password id="password" v-model="password" toggleMask :feedback="false" class="w-full" placeholder="Crea una contraseña segura" />
                  </span>
                </div>
              </div>
              
              <!-- Step 2: Plan -->
              <div v-if="currentStep === 1" class="step-content">
                <h2 class="step-title">Selecciona tu Plan</h2>
                
                <div class="plans-container">
                  <div 
                    class="plan-card" 
                    :class="{ 'selected': selectedPlan === 'Mensual' }"
                    @click="selectedPlan = 'Mensual'"
                  >
                    <div class="plan-header">
                      <i class="pi pi-calendar plan-icon"></i>
                      <h3>Plan Mensual</h3>
                    </div>
                    <div class="plan-content">
                      <p class="plan-price">$19.99<span>/mes</span></p>
                      <ul class="plan-features">
                        <li><i class="pi pi-check"></i> Acceso completo por 30 días</li>
                        <li><i class="pi pi-check"></i> Soporte técnico</li>
                        <li><i class="pi pi-check"></i> Actualizaciones incluidas</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div 
                    class="plan-card" 
                    :class="{ 'selected': selectedPlan === 'Anual' }"
                    @click="selectedPlan = 'Anual'"
                  >
                    <div class="plan-badge">Recomendado</div>
                    <div class="plan-header">
                      <i class="pi pi-calendar-plus plan-icon"></i>
                      <h3>Plan Anual</h3>
                    </div>
                    <div class="plan-content">
                      <p class="plan-price">$199.99<span>/año</span></p>
                      <p class="plan-saving">¡Ahorra un 16%!</p>
                      <ul class="plan-features">
                        <li><i class="pi pi-check"></i> Acceso completo por 365 días</li>
                        <li><i class="pi pi-check"></i> Soporte técnico prioritario</li>
                        <li><i class="pi pi-check"></i> Actualizaciones incluidas</li>
                        <li><i class="pi pi-check"></i> Funciones exclusivas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 3: Payment Information -->
              <div v-if="currentStep === 2" class="step-content">
                <h2 class="step-title">Información de Pago</h2>
                <p class="payment-note">Esta es una simulación. No se procesará ningún pago real.</p>
                
                <div class="form-field">
                  <label for="cardNumber">Número de Tarjeta</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-credit-card"></i>
                    <pv-inputText id="cardNumber" v-model="cardNumber" class="w-full" placeholder="1234 5678 9012 3456" />
                  </span>
                </div>
                
                <div class="payment-row">
                  <div class="form-field">
                    <label for="expiryDate">Fecha de Expiración</label>
                    <pv-inputText id="expiryDate" v-model="expiryDate" placeholder="MM/AA" />
                  </div>
                  
                  <div class="form-field">
                    <label for="cvv">CVV</label>
                    <span class="p-input-icon-left">
                      <i class="pi pi-lock"></i>
                      <pv-inputText id="cvv" v-model="cvv" placeholder="123" />
                    </span>
                  </div>
                </div>
                
                <div class="payment-summary">
                  <h3>Resumen de Compra</h3>
                  <div class="summary-row">
                    <span>Plan seleccionado:</span>
                    <span>{{ selectedPlan }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total a pagar:</span>
                    <span>{{ selectedPlan === 'Mensual' ? '$19.99' : '$199.99' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Message Error or Correct -->
              <pv-message v-if="errorMessage" severity="error" :closable="false" class="message-box">
                <i class="pi pi-exclamation-circle message-icon"></i>
                <span class="message-text">{{ errorMessage }}</span>
              </pv-message>
              
              <pv-message v-if="successMessage" severity="success" :closable="false" class="message-box">
                <i class="pi pi-check-circle message-icon"></i>
                <span class="message-text">{{ successMessage }}</span>
              </pv-message>
              
              <!-- Nav buttons -->
              <div class="form-actions">
                <pv-button 
                  v-if="currentStep > 0" 
                  type="button" 
                  label="Anterior" 
                  icon="pi pi-arrow-left" 
                  class="p-button-outlined" 
                  @click="prevStep" 
                />
                
                <pv-button 
                  type="submit" 
                  :label="currentStep === 2 ? 'Completar Registro' : 'Siguiente'" 
                  :icon="currentStep === 2 ? 'pi pi-check' : 'pi pi-arrow-right'" 
                  iconPos="right" 
                  class="p-button-primary" 
                />
              </div>
            </form>
          </template>
        </pv-card>
      </div>
    </div>
</template>
  
  <style scoped>
  .register-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f0e1 0%, #f5f0e1 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
  }
  
  .register-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  :deep(.register-card) {
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
    border: none;
  }
  
  :deep(.register-card .p-card-header) {
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
  
  :deep(.register-card .p-card-content) {
    padding: 0;
  }
  
  .steps-container {
    padding: 1.5rem 2rem;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  :deep(.custom-steps) {
    margin: 0;
  }
  
  :deep(.custom-steps .p-steps-item) {
    flex: 1;
  }
  
  :deep(.custom-steps .p-steps-item .p-menuitem-link) {
    background: transparent;
  }
  
  :deep(.custom-steps .p-steps-item .p-steps-number) {
    background-color: #e2e8f0;
    color: #64748b;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  :deep(.custom-steps .p-steps-item.p-highlight .p-steps-number) {
    background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  :deep(.custom-steps .p-steps-item .p-steps-title) {
    color: #64748b;
    font-weight: 500;
    margin-top: 0.75rem;
  }
  
  :deep(.custom-steps .p-steps-item.p-highlight .p-steps-title) {
    color: #1e293b;
    font-weight: 600;
  }
  
  /* Steps Content */
  .step-content {
    padding: 2rem;
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .step-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  /* Form */
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
  
  /* Plan */
  .plans-container {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  
  .plan-card {
    flex: 1;
    min-width: 250px;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .plan-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .plan-card.selected {
    border-color: #6366f1;
    background-color: #f5f7ff;
    box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.25);
  }
  
  .plan-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.3);
  }
  
  .plan-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .plan-icon {
    font-size: 2rem;
    color: #6366f1;
    margin-bottom: 0.75rem;
  }
  
  .plan-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .plan-content {
    text-align: center;
  }
  
  .plan-price {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .plan-price span {
    font-size: 1rem;
    font-weight: 500;
    color: #64748b;
  }
  
  .plan-saving {
    color: #16a34a;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
  
  .plan-features {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    text-align: left;
  }
  
  .plan-features li {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    color: #475569;
  }
  
  .plan-features li i {
    color: #16a34a;
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
  
  /* Payment Information */
  .payment-note {
    text-align: center;
    color: #64748b;
    font-style: italic;
    margin-bottom: 1.5rem;
  }
  
  .payment-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .payment-row .form-field {
    flex: 1;
    margin-bottom: 0;
  }
  
  .payment-summary {
    background-color: #f8fafc;
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-top: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .payment-summary h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    color: #475569;
  }
  
  .summary-row.total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    font-weight: 600;
    color: #1e293b;
    font-size: 1.1rem;
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
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding: 1.5rem 2rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }
  
  :deep(.p-button) {
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  :deep(.p-button-primary) {
    background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
    border-color: transparent;
  }
  
  :deep(.p-button-primary:hover) {
    background: linear-gradient(135deg, #1e4d2b 0%, #1e4d2b 100%);
    border-color: transparent;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
  }
  
  :deep(.p-button-outlined) {
    color: #000000;
    border-color: #6366f1;
  }
  
  :deep(.p-button-outlined:hover) {
    background-color: #d2d3d8;
    border-color: #4f46e5;
    color: #4f46e5;
  }
  
  :deep(.p-button .p-button-icon-left) {
    margin-right: 0.5rem;
  }
  
  :deep(.p-button .p-button-icon-right) {
    margin-left: 0.5rem;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .register-wrapper {
      padding: 1rem 0;
    }
    
    .card-header .title {
      font-size: 1.75rem;
    }
    
    .plans-container {
      flex-direction: column;
    }
    
    .plan-card {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .payment-row {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-actions {
      flex-direction: column-reverse;
      gap: 1rem;
    }
    
    :deep(.p-button) {
      width: 100%;
    }
  }
  
  @media (max-width: 576px) {
    :deep(.register-card .p-card-header) {
      padding: 1.5rem 1rem;
    }
    
    .step-content {
      padding: 1.5rem 1rem;
    }
    
    :deep(.custom-steps .p-steps-item .p-steps-title) {
      display: none;
    }
  }
  
  .w-full {
    width: 100%;
  }
</style>