<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcherComponent from '@/public/components/language-switcher/language-switcher.component.vue';
import { authService } from '@/public/services/auth.service';

const router = useRouter();
const { t } = useI18n();

const currentStep = ref(0);
const items = ref([
    {
        label: t('registerPage.steps.personalInfo')
    },
    {
        label: t('registerPage.steps.selectPlan')
    },
    {
        label: t('registerPage.steps.payment')
    }
]);

const name = ref('');
const email = ref('');
const password = ref('');

const planOptions = ref([
    { name: t('registerPage.plans.free'), value: 'Free' },
    { name: t('registerPage.plans.monthly'), value: 'Mensual' },
    { name: t('registerPage.plans.yearly'), value: 'Anual' }
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
    errorMessage.value = t('registerPage.errors.missingPersonalInfo');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = t('registerPage.errors.invalidEmail');
    return false;
  }
  errorMessage.value = '';
  return true;
};

const validateStep1 = () => {
  if (!selectedPlan.value) {
    errorMessage.value = t('registerPage.errors.missingPlan');
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

  if (selectedPlan.value !== 'Free' && (!cardNumber.value || !expiryDate.value || !cvv.value)) {
    errorMessage.value = t('registerPage.errors.missingPayment');
    return;
  }

  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    plan: selectedPlan.value
  };

  try {
    // Use the new auth service register method
    const result = await authService.register(userData);
    
    if (result.success) {
      // Update localStorage for backward compatibility
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some(user => user.email === userData.email)) {
        const updatedUsers = users.map(user => 
          user.email === userData.email ? { ...user, ...userData, id: result.user.id } : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } else {
        const newUser = { ...userData, id: result.user.id };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      successMessage.value = t('registerPage.success');
      
      // Clear form
      name.value = '';
      email.value = '';
      password.value = '';
      selectedPlan.value = null;
      cardNumber.value = '';
      expiryDate.value = '';
      cvv.value = '';
      currentStep.value = 0;
      
      setTimeout(() => {
        router.push('/login'); 
      }, 3000);
    } else {
      errorMessage.value = result.message || t('registerPage.errors.registrationFailed');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    errorMessage.value = t('registerPage.errors.registrationFailed');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <LanguageSwitcherComponent/>
    <div class="register-wrapper">
      <div class="register-container">
        <pv-card class="register-card">
          <template #header>
            <div class="card-header">
              <h1 class="title">{{ t('registerPage.title') }}</h1>
              <p class="subtitle">{{ t('registerPage.subtitle') }}</p>
            </div>
          </template>
          
          <template #content>
            <div class="steps-container">
              <pv-steps :model="items" :activeIndex="currentStep" class="custom-steps" :readonly="true"/>
            </div>
            
            <form @submit.prevent="currentStep === 2 ? handleRegistration() : nextStep()">
              <!-- Step 1: Personal Information -->
              <div v-if="currentStep === 0" class="step-content">
                <h2 class="step-title">{{ t('registerPage.steps.personalInfo') }}</h2>
                
                <div class="form-field">
                  <label for="name">{{ t('registerPage.formLabels.fullName') }}</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-user"></i>
                    <pv-inputText id="name" v-model="name" type="text" class="w-full" :placeholder="t('registerPage.placeholders.fullName')" />
                  </span>
                </div>
                
                <div class="form-field">
                  <label for="email">{{ t('registerPage.formLabels.email') }}</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-envelope"></i>
                    <pv-inputText id="email" v-model="email" type="email" class="w-full" :placeholder="t('registerPage.placeholders.email')" />
                  </span>
                </div>
                
                <div class="form-field">
                  <label for="password">{{ t('registerPage.formLabels.password') }}</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-lock"></i>
                    <pv-password id="password" v-model="password" toggleMask :feedback="false" class="w-full" :placeholder="t('registerPage.placeholders.password')" />
                  </span>
                </div>
              </div>
              
              <!-- Step 2: Plan -->
              <div v-if="currentStep === 1" class="step-content">
                <h2 class="step-title">{{ t('registerPage.steps.selectPlan') }}</h2>
                
                <div class="plans-container">
                  <div 
                    class="plan-card" 
                    :class="{ 'selected': selectedPlan === 'Free' }"
                    @click="selectedPlan = 'Free'"
                  >
                    <div class="plan-header">
                      <i class="pi pi-users plan-icon"></i>
                      <h3>{{ t('registerPage.plans.free') }}</h3>
                    </div>
                    <div class="plan-content">
                      <p class="plan-price">S/.0.00<span>/{{ t('registerPage.plans.forever') }}</span></p>
                      <ul class="plan-features">
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.contactBuyers') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.catalogView') }}</li>
                        <li><i class="pi pi-times"></i> {{ t('registerPage.planFeatures.noCarReservations') }}</li>
                        <li><i class="pi pi-times"></i> {{ t('registerPage.planFeatures.limitedFeatures') }}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div 
                    class="plan-card" 
                    :class="{ 'selected': selectedPlan === 'Mensual' }"
                    @click="selectedPlan = 'Mensual'"
                  >
                    <div class="plan-header">
                      <i class="pi pi-calendar plan-icon"></i>
                      <h3>{{ t('registerPage.plans.monthly') }}</h3>
                    </div>
                    <div class="plan-content">
                      <p class="plan-price">S/.50<span>/{{ t('registerPage.plans.month') }}</span></p>
                      <ul class="plan-features">
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.fullAccess30') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.techSupport') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.updatesIncluded') }}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div 
                    class="plan-card" 
                    :class="{ 'selected': selectedPlan === 'Anual' }"
                    @click="selectedPlan = 'Anual'"
                  >
                    <div class="plan-badge">{{ t('registerPage.recommended') }}</div>
                    <div class="plan-header">
                      <i class="pi pi-calendar-plus plan-icon"></i>
                      <h3>{{ t('registerPage.plans.yearly') }}</h3>
                    </div>
                    <div class="plan-content">
                      <p class="plan-price">S/.250.00<span>/{{ t('registerPage.plans.year') }}</span></p>
                      <p class="plan-saving">{{ t('registerPage.plans.save16') }}</p>
                      <ul class="plan-features">
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.fullAccess365') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.prioritySupport') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.updatesIncluded') }}</li>
                        <li><i class="pi pi-check"></i> {{ t('registerPage.planFeatures.exclusiveFeatures') }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 3: Payment Information -->
              <div v-if="currentStep === 2" class="step-content">
                <h2 class="step-title">{{ t('registerPage.steps.payment') }}</h2>
                <p class="payment-note" v-if="selectedPlan === 'Free'">{{ t('registerPage.paymentNote.freePlan') }}</p>
                
                <div v-if="selectedPlan !== 'Free'">
                <div class="form-field">
                  <label for="cardNumber">{{ t('registerPage.formLabels.cardNumber') }}</label>
                  <span class="p-input-icon-left w-full">
                    <i class="pi pi-credit-card"></i>
                    <pv-inputText id="cardNumber" v-model="cardNumber" class="w-full" :placeholder="t('registerPage.placeholders.cardNumber')" />
                  </span>
                </div>
                
                <div class="payment-row">
                  <div class="form-field">
                    <label for="expiryDate">{{ t('registerPage.formLabels.expiryDate') }}</label>
                    <pv-inputText id="expiryDate" v-model="expiryDate" :placeholder="t('registerPage.placeholders.expiryDate')" />
                  </div>
                  
                  <div class="form-field">
                    <label for="cvv">{{ t('registerPage.formLabels.cvv') }}</label>
                    <span class="p-input-icon-left">
                      <i class="pi pi-lock"></i>
                      <pv-inputText id="cvv" v-model="cvv" :placeholder="t('registerPage.placeholders.cvv')" />
                    </span>
                  </div>
                </div>
                
                <div class="payment-summary">
                  <h3>{{ t('registerPage.paymentSummary.title') }}</h3>
                  <div class="summary-row">
                    <span>{{ t('registerPage.paymentSummary.selectedPlan') }}:</span>
                    <span>{{ selectedPlan }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>{{ t('registerPage.paymentSummary.total') }}:</span>
                    <span v-if="selectedPlan === 'Free'">$0.00</span>
                    <span v-else-if="selectedPlan === 'Mensual'">$19.99</span>
                    <span v-else-if="selectedPlan === 'Anual'">$199.99</span>
                  </div>
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
                  :label="t('registerPage.buttons.previous')" 
                  icon="pi pi-arrow-left" 
                  class="p-button-outlined" 
                  @click="prevStep" 
                />
                
                <pv-button 
                  type="submit" 
                  :label="currentStep === 2 ? t('registerPage.buttons.complete') : t('registerPage.buttons.next')" 
                  :icon="currentStep === 2 ? 'pi pi-check' : 'pi pi-arrow-right'" 
                  iconPos="right" 
                  class="p-button-primary" 
                />
              </div>
              
              <!-- Login redirect -->
              <div class="login-prompt">
                <p>{{ t('registerPage.haveAccount') }}</p>
                <pv-button 
                  type="button" 
                  :label="t('registerPage.buttons.login')" 
                  class="p-button-text login-link" 
                  @click="goToLogin"
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
  background: linear-gradient(135deg, #f5f0e1 0%, #ede4d1 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
}

.register-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.register-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

:deep(.register-card) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
  border: none;
  backdrop-filter: blur(10px);
}

:deep(.register-card .p-card-header) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
}

:deep(.register-card .p-card-header::before) {
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

:deep(.register-card .p-card-content) {
  padding: 0;
}

.steps-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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
  width: 3rem;
  height: 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.custom-steps .p-steps-item.p-highlight .p-steps-number) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(30, 77, 43, 0.4);
  transform: scale(1.1);
}

:deep(.custom-steps .p-steps-item .p-steps-title) {
  color: #64748b;
  font-weight: 500;
  margin-top: 1rem;
  font-size: 0.9rem;
}

:deep(.custom-steps .p-steps-item.p-highlight .p-steps-title) {
  color: #1e293b;
  font-weight: 700;
}

/* Steps Content */
.step-content {
  padding: 2.5rem;
  animation: fadeIn 0.5s ease;
  min-height: 400px;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.step-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.step-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #1e4d2b, #2d6b3f);
  border-radius: 2px;
}

/* Form Fields */
.form-field {
  margin-bottom: 2rem;
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

/* Plan Selection */
.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.plan-card {
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.plan-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.plan-card.selected {
  border-color: #1e4d2b;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7e6 100%);
  box-shadow: 0 12px 32px rgba(30, 77, 43, 0.25);
  transform: translateY(-8px);
}

.plan-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
}

.plan-icon {
  font-size: 2.5rem;
  color: #1e4d2b;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.plan-card:hover .plan-icon {
  transform: scale(1.1);
}

.plan-header h3 {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.plan-content {
  text-align: center;
}

.plan-price {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.plan-price span {
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
}

.plan-saving {
  color: #16a34a;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(22, 163, 74, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  text-align: left;
}

.plan-features li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #475569;
  font-weight: 500;
}

.plan-features li i {
  margin-right: 0.75rem;
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

.plan-features li i.pi-check {
  color: #16a34a;
}

.plan-features li i.pi-times {
  color: #dc2626;
}

/* Payment Information */
.payment-note {
  text-align: center;
  color: #16a34a;
  font-weight: 600;
  font-style: italic;
  margin-bottom: 2rem;
  background: rgba(22, 163, 74, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(22, 163, 74, 0.2);
}

.payment-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.payment-row .form-field {
  margin-bottom: 0;
}

.payment-summary {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.payment-summary h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #475569;
  font-weight: 500;
}

.summary-row.total {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  font-weight: 700;
  color: #1e293b;
  font-size: 1.25rem;
}

/* Messages */
:deep(.message-box) {
  margin: 2rem 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.message-box .p-message-wrapper) {
  padding: 1.5rem;
  width: 100%;
}

.message-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.message-text {
  font-weight: 600;
  line-height: 1.5;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 2px solid #e2e8f0;
  gap: 1rem;
}

:deep(.p-button) {
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.025em;
}

:deep(.p-button-primary) {
  background: linear-gradient(135deg, #1e4d2b 0%, #2d6b3f 100%);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(30, 77, 43, 0.3);
}

:deep(.p-button-primary:hover) {
  background: linear-gradient(135deg, #2d6b3f 0%, #1e4d2b 100%);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(30, 77, 43, 0.4);
  transform: translateY(-2px);
}

:deep(.p-button-outlined) {
  color: #374151;
  border-color: #d1d5db;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.p-button-outlined:hover) {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #1f2937;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

:deep(.p-button .p-button-icon-left) {
  margin-right: 0.75rem;
}

:deep(.p-button .p-button-icon-right) {
  margin-left: 0.75rem;
}

/* Login prompt */
.login-prompt {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem;
  gap: 1rem;
}

.login-prompt p {
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

:deep(.login-link) {
  color: #1e4d2b;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

:deep(.login-link:hover) {
  background-color: rgba(30, 77, 43, 0.1);
  color: #1e4d2b;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .register-container {
    max-width: 100%;
  }
  
  .plans-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .step-content {
    padding: 2rem;
    min-height: 350px;
  }
  
  .steps-container {
    padding: 1.5rem;
  }
  
  :deep(.custom-steps .p-steps-item .p-steps-number) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .step-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .plan-card {
    padding: 1.5rem;
  }
  
  .plan-icon {
    font-size: 2rem;
  }
  
  .plan-price {
    font-size: 2rem;
  }
  
  .payment-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .payment-summary {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .register-wrapper {
    padding: 1rem 0.5rem;
  }
  
  :deep(.register-card .p-card-header) {
    padding: 2.5rem 1.5rem;
  }
  
  .card-header .title {
    font-size: 2.25rem;
  }
  
  .card-header .subtitle {
    font-size: 1rem;
  }
  
  .step-content {
    padding: 1.5rem;
    min-height: 300px;
  }
  
  .steps-container {
    padding: 1.25rem;
  }
  
  :deep(.custom-steps .p-steps-item .p-steps-title) {
    display: none;
  }
  
  .step-title {
    font-size: 1.375rem;
    margin-bottom: 1.25rem;
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
  
  .plan-card {
    padding: 1.25rem;
  }
  
  .plan-header h3 {
    font-size: 1.25rem;
  }
  
  .plan-price {
    font-size: 1.75rem;
  }
  
  .plan-features li {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }
  
  .payment-summary {
    padding: 1.25rem;
  }
  
  :deep(.p-button) {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  :deep(.register-card .p-card-header) {
    padding: 1.5rem 0.75rem;
  }
  
  .card-header .title {
    font-size: 1.75rem;
  }
  
  .step-content {
    padding: 1rem;
  }
  
  .steps-container {
    padding: 0.75rem;
  }
  
  .step-title {
    font-size: 1.25rem;
  }
  
  :deep(.p-inputtext) {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
  }
  
  .plan-card {
    padding: 1rem;
  }
  
  .plan-price {
    font-size: 1.5rem;
  }
  
  .payment-summary {
    padding: 1rem;
  }
  
  .form-actions {
    padding: 1rem;
  }
  
  :deep(.p-button) {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}

.w-full {
  width: 100%;
}
</style>