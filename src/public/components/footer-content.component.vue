<script setup>
import certiwebLogo from '@/assets/certiweb.png'
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const navigateToTerms = () => {
  router.push(`/terms-of-use`);
};
</script>

<template>
  <footer id="footer" class="footer-content">
    <div class="footer-inner">
      <div class="footer-logo">
        <img :src="certiwebLogo" alt="CertiWeb Logo" class="logo" />
      </div>
      <div class="footer-text">
        {{ t('footer.copyright') }}
      </div>
      <div class="footer-link" @click="navigateToTerms">
        <a class="footer-terms">
          {{ t('footer.terms') }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-content {
  background: linear-gradient(135deg, #f5f0e1 0%, #ede4d1 100%);
  padding: 1.5rem 0;
  width: 100%;
  border-top: 1px solid rgba(45, 71, 57, 0.1);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  gap: 1.5rem;
}

.footer-logo {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  order: 1;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: white;
  border: 3px solid rgba(45, 71, 57, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.footer-text {
  flex: 1 1 auto;
  text-align: center;
  color: #2d4739;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.4;
  order: 2;
}

.footer-link {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  order: 3;
  cursor: pointer;
}

.footer-terms {
  color: #2d4739;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(45, 71, 57, 0.05);
  border: 1px solid transparent;
}

.footer-terms:hover {
  color: #1e4d2b;
  background: rgba(30, 77, 43, 0.1);
  border-color: rgba(30, 77, 43, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-inner {
    padding: 0 1.5rem;
    gap: 1rem;
  }
  
  .footer-text {
    font-size: 1rem;
  }
  
  .logo {
    width: 48px;
    height: 48px;
  }
  
  .footer-terms {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 1.25rem 0;
  }
  
  .footer-inner {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
    gap: 1rem;
  }
  
  .footer-logo {
    order: 1;
  }
  
  .footer-text {
    order: 2;
    font-size: 0.95rem;
    max-width: 300px;
  }
  
  .footer-link {
    order: 3;
    justify-content: center;
  }
  
  .logo {
    width: 44px;
    height: 44px;
  }
  
  .footer-terms {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 1rem 0;
  }
  
  .footer-inner {
    padding: 0 0.75rem;
    gap: 0.75rem;
  }
  
  .footer-text {
    font-size: 0.875rem;
    line-height: 1.3;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
  
  .footer-terms {
    font-size: 0.85rem;
    padding: 0.35rem 0.7rem;
  }
}

@media (max-width: 360px) {
  .footer-inner {
    padding: 0 0.5rem;
    gap: 0.5rem;
  }
  
  .footer-text {
    font-size: 0.8rem;
  }
  
  .logo {
    width: 36px;
    height: 36px;
  }
  
  .footer-terms {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>