<script setup lang="ts">
import { toast } from "vue-sonner";
import { DatePicker } from "@/components/ui/date-picker";

definePageMeta({
  layout: "admin",
});

const filterByDate = ref(false);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const includeHeaders = ref(true);
const anonymize = ref(false);
const isExporting = ref(false);

const exportFormats = [
  {
    id: "csv",
    name: "CSV",
    icon: "lucide:file-text",
    description: "Format texte universel",
  },
  {
    id: "json",
    name: "JSON",
    icon: "lucide:file-json",
    description: "Format données structurées",
  },
];

const dataCategories = ref([
  {
    id: "registrations",
    name: "Inscriptions",
    count: 0,
    icon: "lucide:users",
    selected: true,
  },
  {
    id: "events",
    name: "Événements",
    count: 0,
    icon: "lucide:calendar",
    selected: false,
  },
  {
    id: "meals",
    name: "Repas",
    count: 0,
    icon: "lucide:utensils",
    selected: false,
  },
  {
    id: "activities",
    name: "Activités",
    count: 0,
    icon: "lucide:activity",
    selected: false,
  },
]);

const selectedFormat = ref("csv");

const selectedCategories = computed(() =>
  dataCategories.value.filter((c) => c.selected).map((c) => c.id),
);

// Fetch counts on mount
const fetchCounts = async () => {
  try {
    const counts = await $fetch<Record<string, number>>("/api/export/counts");
    for (const cat of dataCategories.value) {
      if (counts[cat.id] !== undefined) {
        cat.count = counts[cat.id] ?? 0;
      }
    }
  } catch (err) {
    console.error("Error fetching counts:", err);
  }
};

// Export data
const handleExport = async () => {
  if (!selectedCategories.value.length) {
    toast.error("Veuillez sélectionner au moins une catégorie");
    return;
  }

  isExporting.value = true;
  try {
    const response = await $fetch("/api/export", {
      method: "POST",
      body: {
        categories: selectedCategories.value,
        format: selectedFormat.value,
        includeHeaders: includeHeaders.value,
        anonymize: anonymize.value,
        startDate:
          filterByDate.value && startDate.value
            ? startDate.value.toISOString()
            : undefined,
        endDate:
          filterByDate.value && endDate.value
            ? endDate.value.toISOString()
            : undefined,
      },
    });

    // Create blob and download
    const isJson = selectedFormat.value === "json";
    const content = isJson ? JSON.stringify(response, null, 2) : response;
    const blob = new Blob([content as string], {
      type: isJson ? "application/json" : "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `export_${new Date().toISOString().split("T")[0]}.${selectedFormat.value}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Export téléchargé avec succès");
  } catch (err: any) {
    console.error("Export error:", err);
    toast.error(err.data?.statusMessage || "Erreur lors de l'export");
  } finally {
    isExporting.value = false;
  }
};

onMounted(() => {
  fetchCounts();
});
</script>

<template>
  <div class="max-w-6xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Export de données</h1>
        <p class="text-muted-foreground">
          Exporter les inscriptions et données en CSV/Excel
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Export Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Data Selection -->
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle>Données à exporter</CardTitle>
            <CardDescription
              >Sélectionnez les catégories de données</CardDescription
            >
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="cat in dataCategories"
                :key="cat.id"
                @click="cat.selected = !cat.selected"
                :class="[
                  'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  cat.selected
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/50 hover:bg-muted',
                ]"
              >
                <div
                  :class="[
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    cat.selected ? 'bg-primary/10' : 'bg-background',
                  ]"
                >
                  <Icon
                    :name="cat.icon"
                    :class="[
                      'h-5 w-5',
                      cat.selected ? 'text-primary' : 'text-muted-foreground',
                    ]"
                  />
                </div>
                <div class="flex-1">
                  <p class="font-medium">{{ cat.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ cat.count }} entrées
                  </p>
                </div>
                <Icon
                  :name="cat.selected ? 'lucide:check-circle' : 'lucide:circle'"
                  :class="[
                    'h-5 w-5',
                    cat.selected ? 'text-primary' : 'text-muted-foreground/30',
                  ]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Format Selection -->
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle>Format d'export</CardTitle>
            <CardDescription>Choisissez le format de fichier</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="format in exportFormats"
                :key="format.id"
                @click="selectedFormat = format.id"
                :class="[
                  'text-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/50 hover:bg-muted',
                ]"
              >
                <Icon
                  :name="format.icon"
                  :class="[
                    'h-8 w-8 mx-auto mb-2',
                    selectedFormat === format.id
                      ? 'text-primary'
                      : 'text-muted-foreground',
                  ]"
                />
                <p class="font-medium text-sm">{{ format.name }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ format.description }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Export Options -->
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Inclure les en-têtes</p>
                <p class="text-sm text-muted-foreground">
                  Ajouter les noms de colonnes
                </p>
              </div>
              <Switch v-model:checked="includeHeaders" />
            </div>
            <Separator />
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Filtrer par date</p>
                  <p class="text-sm text-muted-foreground">
                    Exporter seulement une période
                  </p>
                </div>
                <Switch v-model:checked="filterByDate" />
              </div>
              <div v-if="filterByDate" class="grid grid-cols-2 gap-4 pt-2">
                <div class="space-y-2">
                  <Label class="text-xs">Date de début</Label>
                  <DatePicker v-model="startDate" placeholder="Début" />
                </div>
                <div class="space-y-2">
                  <Label class="text-xs">Date de fin</Label>
                  <DatePicker v-model="endDate" placeholder="Fin" />
                </div>
              </div>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Anonymiser les données</p>
                <p class="text-sm text-muted-foreground">
                  Masquer les informations personnelles
                </p>
              </div>
              <Switch v-model:checked="anonymize" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              class="w-full rounded-full"
              size="lg"
              @click="handleExport"
              :disabled="isExporting || !selectedCategories.length"
            >
              <Icon
                v-if="isExporting"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <Icon v-else name="lucide:download" class="mr-2 h-4 w-4" />
              {{ isExporting ? "Export en cours..." : "Exporter les données" }}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Info Card -->
      <div>
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Conseils d'export</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-start gap-3">
              <Icon name="lucide:info" class="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p class="font-medium text-sm">Format CSV</p>
                <p class="text-xs text-muted-foreground">
                  Compatible avec Excel, Google Sheets et autres tableurs.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <Icon
                name="lucide:shield"
                class="h-5 w-5 text-green-500 mt-0.5"
              />
              <div>
                <p class="font-medium text-sm">Anonymisation</p>
                <p class="text-xs text-muted-foreground">
                  Masque les noms, emails et téléphones pour le partage.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <Icon
                name="lucide:calendar"
                class="h-5 w-5 text-orange-500 mt-0.5"
              />
              <div>
                <p class="font-medium text-sm">Filtre par date</p>
                <p class="text-xs text-muted-foreground">
                  Filtrez les données par période de création.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
