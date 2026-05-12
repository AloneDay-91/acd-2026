<script setup lang="ts">
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "#components";

const config = useRuntimeConfig();
const demo = config.public.demo as {
  mode: boolean | string;
  adminEmail: string;
  adminPassword: string;
  userEmail: string;
  userPassword: string;
};

const isOpen = ref(true);
const dismissed = ref(false);

const isDemoMode = computed(() => demo.mode === true || demo.mode === "true");
const hasAdmin = computed(() => !!(demo.adminEmail && demo.adminPassword));
const hasUser = computed(() => !!(demo.userEmail && demo.userPassword));
const shouldShow = computed(() => isDemoMode.value && (hasAdmin.value || hasUser.value) && !dismissed.value);

function copy(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copié`);
}
</script>

<template>
  <div
    v-if="shouldShow"
    class="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)]"
  >
    <div
      class="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg overflow-hidden"
    >
      <!-- Header -->
      <button
        type="button"
        class="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/50 transition-colors"
        @click="isOpen = !isOpen"
      >
        <div class="flex items-center gap-2">
          <Badge variant="secondary" class="gap-1">
            <Icon name="lucide:flask-conical" class="size-3" />
            DÉMO
          </Badge>
          <span class="text-sm font-medium">Identifiants de test</span>
        </div>
        <Icon
          :name="isOpen ? 'lucide:chevron-down' : 'lucide:chevron-up'"
          class="size-4 text-muted-foreground transition-transform"
        />
      </button>

      <!-- Body -->
      <div v-if="isOpen" class="px-4 pb-4 space-y-3 border-t pt-3">
        <!-- Admin -->
        <div v-if="hasAdmin" class="space-y-1.5">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Icon name="lucide:shield" class="size-3" />
            Administrateur
          </div>
          <button
            type="button"
            class="w-full text-left font-mono text-xs bg-muted hover:bg-muted/70 rounded px-2 py-1.5 flex items-center justify-between gap-2 transition-colors"
            @click="copy(demo.adminEmail, 'Email admin')"
          >
            <span class="truncate">{{ demo.adminEmail }}</span>
            <Icon name="lucide:copy" class="size-3 shrink-0 text-muted-foreground" />
          </button>
          <button
            type="button"
            class="w-full text-left font-mono text-xs bg-muted hover:bg-muted/70 rounded px-2 py-1.5 flex items-center justify-between gap-2 transition-colors"
            @click="copy(demo.adminPassword, 'Mot de passe admin')"
          >
            <span class="truncate">{{ demo.adminPassword }}</span>
            <Icon name="lucide:copy" class="size-3 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <!-- User -->
        <div v-if="hasUser" class="space-y-1.5">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Icon name="lucide:user" class="size-3" />
            Utilisateur
          </div>
          <button
            type="button"
            class="w-full text-left font-mono text-xs bg-muted hover:bg-muted/70 rounded px-2 py-1.5 flex items-center justify-between gap-2 transition-colors"
            @click="copy(demo.userEmail, 'Email utilisateur')"
          >
            <span class="truncate">{{ demo.userEmail }}</span>
            <Icon name="lucide:copy" class="size-3 shrink-0 text-muted-foreground" />
          </button>
          <button
            type="button"
            class="w-full text-left font-mono text-xs bg-muted hover:bg-muted/70 rounded px-2 py-1.5 flex items-center justify-between gap-2 transition-colors"
            @click="copy(demo.userPassword, 'Mot de passe utilisateur')"
          >
            <span class="truncate">{{ demo.userPassword }}</span>
            <Icon name="lucide:copy" class="size-3 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <!-- Note -->
        <p class="text-[11px] text-muted-foreground leading-relaxed pt-1">
          Cliquez sur un champ pour le copier. Les données sont réinitialisées toutes les 30 min.
        </p>

        <Button
          variant="ghost"
          size="sm"
          class="w-full h-7 text-xs"
          @click="dismissed = true"
        >
          Masquer
        </Button>
      </div>
    </div>
  </div>
</template>
