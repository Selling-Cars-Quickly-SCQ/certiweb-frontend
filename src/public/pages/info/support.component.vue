<script setup>
import { useRouter } from 'vue-router';
import toolbarComponent from '../../../certifications/components/dashboard/toolbar/toolbar.component.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const goToDashboard = () => {
  router.push('/');
};
</script>

<template>
  <toolbar-component/>
  <div class="info-page-container">
    <pv-card class="info-card">
      <template #title>
        <div class="card-header">
          <div class="icon-wrapper">
            <i class="pi pi-question-circle"></i>
          </div>
          <h1>{{ t('supportPage.title') }}</h1>
        </div>
      </template>
      <template #content>
        <div class="card-content">
          <p class="welcome-text">{{ t('supportPage.welcomeMessage') }}</p>
          
          <div class="contact-section">
            <h3>{{ t('supportPage.contactTitle') }}</h3>
            <div class="contact-grid">
              <div class="contact-item">
                <i class="pi pi-envelope contact-icon"></i>
                <div>
                  <strong>{{ t('supportPage.emailLabel') }}:</strong>
                  <span>soporte@certiweb.com</span>
                </div>
              </div>
              <div class="contact-item">
                <i class="pi pi-phone contact-icon"></i>
                <div>
                  <strong>{{ t('supportPage.phoneLabel') }}:</strong>
                  <span>+123 456 7890</span>
                </div>
              </div>
              <div class="contact-item">
                <i class="pi pi-clock contact-icon"></i>
                <div>
                  <strong>{{ t('supportPage.scheduleLabel') }}:</strong>
                  <span>{{ t('supportPage.scheduleTime') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="faq-section">
            <p>{{ t('supportPage.faqMessage') }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="card-footer">
          <pv-button 
            :label="t('supportPage.backButton')" 
            icon="pi pi-home"
            @click="goToDashboard" 
            class="home-button" 
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>
  
<style scoped>
  .info-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 85vh;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f5f0e1 0%, #f0e6d2 100%);
  }
  
  .info-card {
    max-width: 800px;
    width: 100%;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 
      0 20px 40px rgba(139, 69, 19, 0.1),
      0 8px 16px rgba(139, 69, 19, 0.05);
    border: 1px solid rgba(205, 133, 63, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 25px 50px rgba(139, 69, 19, 0.15),
      0 12px 24px rgba(139, 69, 19, 0.08);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 2rem 1rem;
    background: linear-gradient(135deg, #cd853f 0%, #daa520 100%);
    color: white;
    margin: -1.5rem -1.5rem 0;
  }
  
  .icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-header i {
    font-size: 2.5rem;
  }
  
  .card-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card-content {
    padding: 2rem;
    line-height: 1.7;
  }
  
  .welcome-text {
    font-size: 1.1rem;
    color: #5d4e37;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 500;
  }
  
  .contact-section h3 {
    color: #8b4513;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  .contact-grid {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #faf8f3 0%, #f5f0e1 100%);
    border-radius: 12px;
    border-left: 4px solid #cd853f;
    transition: all 0.3s ease;
  }
  
  .contact-item:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 16px rgba(139, 69, 19, 0.1);
  }
  
  .contact-icon {
    font-size: 1.5rem;
    color: #cd853f;
    margin-top: 0.2rem;
    min-width: 24px;
  }
  
  .contact-item div {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .contact-item strong {
    color: #8b4513;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .contact-item span {
    color: #5d4e37;
    font-size: 0.95rem;
  }
  
  .faq-section {
    background: linear-gradient(135deg, #f0e6d2 0%, #e6d7c3 100%);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(205, 133, 63, 0.2);
  }
  
  .faq-section p {
    margin: 0;
    color: #5d4e37;
    font-size: 1rem;
  }
  
  .faq-section strong {
    color: #8b4513;
  }
  
  .card-footer {
    padding: 1.5rem 2rem 2rem;
    text-align: center;
    background: linear-gradient(to top, #faf8f3 0%, transparent 100%);
  }
  
  .home-button {
    background: linear-gradient(135deg, #cd853f 0%, #daa520 100%) !important;
    border: none !important;
    padding: 0.8rem 2rem !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    border-radius: 25px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(205, 133, 63, 0.3) !important;
  }
  
  .home-button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(205, 133, 63, 0.4) !important;
    background: linear-gradient(135deg, #daa520 0%, #cd853f 100%) !important;
  }
  
  .home-button:active {
    transform: translateY(0) !important;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .info-page-container {
      padding: 1rem 0.5rem;
      min-height: 90vh;
    }
    
    .card-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
      padding: 1.5rem;
    }
    
    .card-header h1 {
      font-size: 1.5rem;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .contact-item {
      padding: 1rem;
    }
    
    .card-footer {
      padding: 1rem 1.5rem 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .card-header i {
      font-size: 2rem;
    }
    
    .card-header h1 {
      font-size: 1.3rem;
    }
    
    .contact-item {
      flex-direction: column;
      text-align: center;
      gap: 0.8rem;
    }
    
    .contact-icon {
      align-self: center;
    }
  }
</style>