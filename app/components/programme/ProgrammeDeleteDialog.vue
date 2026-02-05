<script setup lang="ts">
import { toast } from "vue-sonner";

interface EventData {
  id: string;
  title: string;
}

const props = defineProps<{
  open: boolean;
  event: EventData | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isLoading = ref(false);

async function handleDelete() {
  if (!props.event) return;

  isLoading.value = true;

  try {
    await $fetch(`/api/events/${props.event.id}`, {
      method: "DELETE",
    });

    toast.success("Événement supprimé avec succès");
    emit("success");
    emit("update:open", false);
  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue lors de la suppression");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer
          <span class="font-semibold">{{ event?.title }}</span> ? Cette action
          est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">Annuler</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="handleDelete"
          :disabled="isLoading"
        >
          <Icon
            v-if="isLoading"
            name="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
          />
          Supprimer
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
