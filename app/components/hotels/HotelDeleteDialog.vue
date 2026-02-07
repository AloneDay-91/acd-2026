<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "vue-sonner";

const props = defineProps<{
  open: boolean;
  hotelId?: string | null;
  hotelName?: string | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isLoading = ref(false);

async function handleDelete() {
  if (!props.hotelId) return;

  isLoading.value = true;
  try {
    await $fetch(`/api/hotels/${props.hotelId}`, {
      method: "DELETE",
    });
    toast.success("Hôtel supprimé avec succès");
    emit("success");
    emit("update:open", false);
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors de la suppression de l'hôtel");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action est irréversible. Cela supprimera définitivement l'hôtel
          <span class="font-medium text-foreground">{{
            hotelName || "sélectionné"
          }}</span>
          de la liste des partenaires.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">Annuler</AlertDialogCancel>
        <AlertDialogAction
          @click.prevent="handleDelete"
          :disabled="isLoading"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
