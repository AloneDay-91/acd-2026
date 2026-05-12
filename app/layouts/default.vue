<script setup lang="ts">
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import DemoCredentialsBanner from "@/components/DemoCredentialsBanner.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <DemoCredentialsBanner />
  </div>
</template>
