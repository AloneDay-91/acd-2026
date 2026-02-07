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
  activityId?: string | null;
  activityName?: string | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isLoading = ref(false);

async function handleDelete() {
  if (!props.activityId) return;

  isLoading.value = true;
  try {
    await $fetch(`/api/activities/${props.activityId}`, {
      method: "DELETE",
    });
    toast.success("Activité supprimée avec succès");
    emit("success");
    emit("update:open", false);
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors de la suppression de l'activité");
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
          Cette action est irréversible. Cela supprimera définitivement
          l'activité
          <span class="font-medium text-foreground">{{
            activityName || "sélectionnée"
          }}</span>
          et toutes les inscriptions associées.
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
