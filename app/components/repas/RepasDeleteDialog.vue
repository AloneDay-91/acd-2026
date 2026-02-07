<script setup lang="ts">
import { toast } from "vue-sonner";

interface MealData {
  id: string;
  name: string;
}

const props = defineProps<{
  open: boolean;
  meal?: MealData | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isLoading = ref(false);

async function handleDelete() {
  if (!props.meal?.id) return;

  isLoading.value = true;

  try {
    await $fetch(`/api/meals/${props.meal.id}`, {
      method: "DELETE",
    });

    toast.success("Repas supprimé avec succès");
    emit("success");
    emit("update:open", false);
  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer ce repas ?</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer "{{ meal?.name }}" ? Cette action
          est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">Annuler</AlertDialogCancel>
        <AlertDialogAction
          :disabled="isLoading"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click.prevent="handleDelete"
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
