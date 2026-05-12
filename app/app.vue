<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
import DemoCredentialsBanner from "@/components/DemoCredentialsBanner.vue";
</script>

<template>
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <DemoCredentialsBanner />
</template>
