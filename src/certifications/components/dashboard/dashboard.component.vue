<script setup>
import toolbarComponent from './toolbar/toolbar.component.vue';
import searchFiltersComponent from './search-filters/search-filters.component.vue';
import newCertiCarsComponent from './new-certi-cars/new-certi-cars.component.vue';
import createCertificateComponent from './create-certificate/create-certificate.component.vue';
import brandSearchComponent from './brand-search/brand-search.component.vue';
import footerContentComponent from '../../../public/components/footer-content.component.vue';
</script>

<template>
    <!--Toolbar-->
    <toolbarComponent/>

    <!--Search Bar-->
    <searchFiltersComponent/>
    
    <!--New Certi Cars-->
    <newCertiCarsComponent/>

    <!--Create Certificate-->
    <createCertificateComponent/>

    <!--Brand Search-->
    <brandSearchComponent/>

    <!--Footer-->
    <footerContentComponent/>
</template>

<style scoped>

</style>