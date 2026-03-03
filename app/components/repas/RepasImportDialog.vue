<script setup lang="ts">
import { toast } from "vue-sonner";

defineProps<{ open: boolean }>();
const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const file = ref<File | null>(null);
const isLoading = ref(false);
const result = ref<{ createdMeals: number; createdOptions: number; errors: string[] } | null>(null);

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  file.value = target.files?.[0] ?? null;
  result.value = null;
}

function close() {
  file.value = null;
  result.value = null;
  emit("update:open", false);
}

async function handleUpload() {
  if (!file.value) return;

  isLoading.value = true;
  result.value = null;

  const formData = new FormData();
  formData.append("file", file.value);

  try {
    const data = await $fetch<{ createdMeals: number; createdOptions: number; errors: string[] }>(
      "/api/meals/import",
      { method: "POST", body: formData },
    );
    result.value = data;
    if (data.createdMeals > 0) {
      toast.success(`${data.createdMeals} repas importé${data.createdMeals > 1 ? "s" : ""} avec succès`);
      emit("success");
    }
    if (data.errors.length > 0 && data.createdMeals === 0) {
      toast.error("L'import a échoué, vérifiez le fichier");
    }
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Erreur lors de l'import");
  } finally {
    isLoading.value = false;
  }
}

const csvTemplate = `nom;date;type;prix;type_option;nom_option;allergenes
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;STARTER;Salade verte;GLUTEN
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;STARTER;Soupe de légumes;
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;MAIN;Poulet rôti;
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;MAIN;Ratatouille;
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;DESSERT;Tarte aux pommes;GLUTEN
Déjeuner Jour 1;2026-06-15;LUNCH;12.50;DESSERT;Salade de fruits;
Dîner Jour 1;2026-06-15;DINNER;18.00;STARTER;Terrine maison;
Dîner Jour 1;2026-06-15;DINNER;18.00;MAIN;Bœuf bourguignon;
Dîner Jour 1;2026-06-15;DINNER;18.00;DESSERT;Crème brûlée;MILK`;

function downloadTemplate() {
  const blob = new Blob([csvTemplate], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modele_import_repas.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <Dialog :open="open" @update:open="close">
    <DialogContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon name="lucide:upload" class="h-4 w-4" />
          Importer des repas
        </DialogTitle>
        <DialogDescription>
          Importez des repas et leurs options depuis un fichier CSV.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Format explanation -->
        <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Format CSV attendu
          </p>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Séparateur <code class="bg-muted px-1 rounded">,</code> ou <code class="bg-muted px-1 rounded">;</code>. Chaque ligne = une option de repas.
            Les lignes partageant le même <em>nom + date + type</em> sont regroupées en un seul repas.
          </p>
          <div class="overflow-x-auto">
            <table class="text-[11px] w-full border-collapse">
              <thead>
                <tr class="text-muted-foreground">
                  <th class="text-left pr-3 pb-1 font-medium">Colonne</th>
                  <th class="text-left pb-1 font-medium">Valeurs acceptées</th>
                </tr>
              </thead>
              <tbody class="text-foreground">
                <tr><td class="pr-3 py-0.5 font-mono">nom</td><td>Texte libre</td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">date</td><td>YYYY-MM-DD</td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">type</td><td><code class="bg-muted px-1 rounded">LUNCH</code> ou <code class="bg-muted px-1 rounded">DINNER</code></td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">prix</td><td>Nombre décimal (ex: 12.50)</td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">type_option</td><td><code class="bg-muted px-1 rounded">STARTER</code> / <code class="bg-muted px-1 rounded">MAIN</code> / <code class="bg-muted px-1 rounded">DESSERT</code></td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">nom_option</td><td>Texte libre</td></tr>
                <tr><td class="pr-3 py-0.5 font-mono">allergenes</td><td>Séparés par <code class="bg-muted px-1 rounded">|</code> (ex: GLUTEN|MILK)</td></tr>
              </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" class="h-7 text-xs gap-1.5" @click="downloadTemplate">
            <Icon name="lucide:download" class="h-3 w-3" />
            Télécharger le modèle
          </Button>
        </div>

        <!-- File input -->
        <div class="space-y-1.5">
          <Label for="csv-meals">Fichier CSV</Label>
          <Input
            id="csv-meals"
            type="file"
            accept=".csv,.txt"
            @change="handleFileChange"
          />
        </div>

        <!-- Result -->
        <div v-if="result" class="space-y-2">
          <div v-if="result.createdMeals > 0" class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Icon name="lucide:check-circle" class="h-4 w-4 shrink-0" />
            <span>
              {{ result.createdMeals }} repas importé{{ result.createdMeals > 1 ? "s" : "" }}
              ({{ result.createdOptions }} option{{ result.createdOptions > 1 ? "s" : "" }})
            </span>
          </div>
          <div v-if="result.errors.length > 0" class="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
            <p class="text-xs font-semibold text-destructive">
              {{ result.errors.length }} erreur{{ result.errors.length > 1 ? "s" : "" }}
            </p>
            <ul class="text-xs text-destructive/80 space-y-0.5 list-disc ml-4">
              <li v-for="(err, i) in result.errors" :key="i">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="close" :disabled="isLoading">
          {{ result?.createdMeals ? "Fermer" : "Annuler" }}
        </Button>
        <Button @click="handleUpload" :disabled="!file || isLoading">
          <Icon v-if="isLoading" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:upload" class="mr-2 h-4 w-4" />
          Importer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
