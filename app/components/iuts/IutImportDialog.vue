<script setup lang="ts">
import { toast } from "vue-sonner";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["update:open", "success"]);

const file = ref<File | null>(null);
const isLoading = ref(false);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0] || null;
  }
};

const handleUpload = async () => {
  if (!file.value) return;

  isLoading.value = true;
  const formData = new FormData();
  formData.append("file", file.value);

  try {
    await $fetch("/api/iuts/import", {
      method: "POST",
      body: formData,
    });
    toast.success("Import réalisé avec succès");
    emit("success");
    emit("update:open", false);
    file.value = null;
  } catch (error: any) {
    console.error(error);
    toast.error(error.statusMessage || "Erreur lors de l'import");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Importer des IUTs</DialogTitle>
        <DialogDescription>
          Sélectionnez un fichier CSV (séparateur ; ou ,). Format:
          Nom;Ville;Code
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="csv">Fichier CSV</Label>
          <Input
            id="csv"
            type="file"
            accept=".csv,.txt"
            @change="handleFileChange"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)"
          >Annuler</Button
        >
        <Button @click="handleUpload" :disabled="!file || isLoading">
          <Icon
            name="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
            v-if="isLoading"
          />
          Importer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
