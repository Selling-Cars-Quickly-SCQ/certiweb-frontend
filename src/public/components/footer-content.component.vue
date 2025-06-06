<script setup>
import certiwebLogo from '@/assets/certiweb.png'
import { useRouter } from 'vue-router';

const router = useRouter();
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
        © 2025 Certiweb.com. Reservados todos los derechos.
      </div>
      <div class="footer-link" @click="navigateToTerms('/terms-of-use')">
        <a class="footer-terms">
          Términos y Condiciones
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-content {
  background: #f5f0e1;
  padding: 0.5rem 0;
  width: 100%;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.footer-logo {
  flex: 0 0 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: contain;
  background: white;
}

.footer-text {
  flex: 1 1 auto;
  text-align: center;
  color: #2d4739;
  font-size: 1.1rem;
  font-weight: 400;
}

.footer-link {
  flex: 0 0 220px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.footer-terms {
  color: #2d4739;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  transition: color 0.2s;
}

.footer-terms:hover {
  color: #1e4d2b;
  text-decoration: underline;
}
</style>