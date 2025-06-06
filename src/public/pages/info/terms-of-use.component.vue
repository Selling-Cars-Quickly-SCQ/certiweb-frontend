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
  <toolbarComponent/>
  <div class="info-page-container">
    <pv-card class="info-card">
      <template #title>
        <div class="card-header">
          <div class="icon-wrapper">
            <i class="pi pi-question-circle"></i>
          </div>
          <div class="header-content">
            <h1>{{ t('termsPage.title') }}</h1>
            <p class="header-subtitle">{{ t('termsPage.lastUpdate') }}</p>
          </div>
        </div>
      </template>
      <template #content>
        <div class="card-content">
          <div class="intro-section">
            <p class="intro-text">{{ t('termsPage.introText') }}</p>
          </div>
          
          <div class="terms-content">
            <section class="term-section">
              <div class="section-header">
                <span class="section-number">1</span>
                <h2>{{ t('termsPage.section1.title') }}</h2>
              </div>
              <div class="section-content">
                <p>{{ t('termsPage.section1.content', { service: 'CertiWeb' }) }}</p>
              </div>
            </section>

            <section class="term-section">
              <div class="section-header">
                <span class="section-number">2</span>
                <h2>{{ t('termsPage.section2.title') }}</h2>
              </div>
              <div class="section-content">
                <p>{{ t('termsPage.section2.content') }}</p>
              </div>
            </section>

            <section class="term-section">
              <div class="section-header">
                <span class="section-number">3</span>
                <h2>{{ t('termsPage.section3.title') }}</h2>
              </div>
              <div class="section-content">
                <p>{{ t('termsPage.section3.content') }}</p>
              </div>
            </section>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="card-footer">
          <pv-button 
            :label="t('termsPage.backButton')" 
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
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f0e1 0%, #f0e6d2 100%);
}

.info-card {
  max-width: 900px;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(101, 67, 33, 0.1),
    0 8px 16px rgba(101, 67, 33, 0.05);
  border: 1px solid rgba(160, 82, 45, 0.1);
  overflow: hidden;
  margin: 2rem 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, #654321 0%, #8b4513 100%);
  color: white;
  margin: -1.5rem -1.5rem 0;
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #daa520, #cd853f, #daa520);
}

.card-header i {
  font-size: 2.5rem;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.header-subtitle {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 400;
}

.card-content {
  padding: 2.5rem;
  line-height: 1.8;
}

.intro-section {
  background: linear-gradient(135deg, #faf8f3 0%, #f5f0e1 100%);
  padding: 2rem;
  border-radius: 15px;
  border-left: 5px solid #cd853f;
  margin-bottom: 3rem;
  position: relative;
}

.intro-section::before {
  content: '';
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23cd853f' opacity='0.1' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: contain;
}

.intro-text {
  margin: 0;
  font-size: 1.15rem;
  color: #5d4e37;
  font-weight: 500;
  text-align: center;
}

.terms-content {
  margin-bottom: 3rem;
}

.term-section {
  margin-bottom: 2.5rem;
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid rgba(205, 133, 63, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.term-section:hover {
  box-shadow: 0 8px 25px rgba(101, 67, 33, 0.08);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8f5f0 0%, #f0e6d2 100%);
  border-bottom: 1px solid rgba(205, 133, 63, 0.1);
}

.section-number {
  background: linear-gradient(135deg, #cd853f 0%, #daa520 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(205, 133, 63, 0.3);
}

.section-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #654321;
  font-weight: 600;
}

.section-content {
  padding: 2rem;
}

.section-content p {
  margin: 0;
  color: #5d4e37;
  font-size: 1rem;
  line-height: 1.7;
}

.section-content strong {
  color: #8b4513;
  font-weight: 600;
}

.disclaimer-section {
  background: linear-gradient(135deg, #fff8dc 0%, #f5deb3 100%);
  padding: 2rem;
  border-radius: 15px;
  border: 2px dashed rgba(205, 133, 63, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 2rem;
}

.disclaimer-icon {
  color: #cd853f;
  font-size: 1.5rem;
  margin-top: 0.2rem;
}

.disclaimer-section p {
  margin: 0;
  color: #8b4513;
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.6;
}

.card-footer {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(to top, #faf8f3 0%, transparent 100%);
  border-top: 1px solid rgba(205, 133, 63, 0.1);
}

.home-button {
  background: linear-gradient(135deg, #654321 0%, #8b4513 100%) !important;
  border: none !important;
  padding: 1rem 2.5rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  border-radius: 30px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 6px 20px rgba(101, 67, 33, 0.3) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.home-button:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 25px rgba(101, 67, 33, 0.4) !important;
  background: linear-gradient(135deg, #8b4513 0%, #654321 100%) !important;
}

.home-button:active {
  transform: translateY(-1px) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-page-container {
    padding: 1rem 0.5rem;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem 1.5rem;
  }
  
  .header-content h1 {
    font-size: 1.8rem;
  }
  
  .card-content {
    padding: 2rem 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .section-content {
    padding: 1.5rem;
  }
  
  .intro-section,
  .disclaimer-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-header i {
    font-size: 2rem;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem 1rem;
  }
  
  .section-header {
    padding: 1rem;
  }
  
  .section-content {
    padding: 1rem;
  }
  
  .disclaimer-section {
    flex-direction: column;
    text-align: center;
  }
}

/* Scroll behavior for long content */
@media (max-height: 800px) {
  .info-page-container {
    align-items: flex-start;
    padding-top: 1rem;
  }
}
</style>