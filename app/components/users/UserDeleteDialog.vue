<script setup lang="ts">
import { toast } from "vue-sonner";
import { authClient } from "@/lib/auth-client";
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

const props = defineProps<{
  open: boolean;
  userId?: string;
  userName?: string;
}>();

const emit = defineEmits(["update:open", "success"]);

const isLoading = ref(false);

async function handleDelete() {
  if (!props.userId) return;
  isLoading.value = true;
  try {
    const { error } = await authClient.admin.removeUser({
      userId: props.userId,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Utilisateur supprimé avec succès");
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
  <AlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer l'utilisateur
          <span class="font-medium text-foreground">{{ userName }}</span>
          ? Cette action est irréversible.
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
