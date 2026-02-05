<script setup lang="ts">
interface MealData {
  id: string;
  name: string;
  description?: string | null;
  date: Date | string;
  mealType: "LUNCH" | "DINNER";
  price: number | string;
  options?: any[];
}

defineProps<{
  meals: MealData[];
}>();

const emit = defineEmits<{
  edit: [meal: MealData];
  delete: [meal: MealData];
}>();

const router = useRouter();

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function countOptions(meal: MealData, type: string) {
  return meal.options?.filter((o) => o.optionType === type).length || 0;
}

function copyToClipboard(text: string) {
  if (import.meta.client) {
    navigator.clipboard.writeText(text);
  }
}

const mealTypeLabels: Record<string, string> = {
  LUNCH: "Déjeuner",
  DINNER: "Dîner",
};
</script>

<template>
  <div class="space-y-2">
    <!-- Empty state -->
    <Card v-if="meals.length === 0" class="rounded-2xl">
      <CardContent class="py-12 text-center">
        <Icon
          name="lucide:utensils"
          class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4"
        />
        <p class="text-muted-foreground">Aucun repas dans la liste</p>
      </CardContent>
    </Card>

    <!-- Meals list with accordion -->
    <Accordion v-else type="single" collapsible class="space-y-2">
      <AccordionItem
        v-for="meal in meals"
        :key="meal.id"
        :value="meal.id"
        class="border rounded-xl bg-card px-4 data-[state=open]:bg-muted/30"
      >
        <AccordionTrigger class="hover:no-underline py-4">
          <div class="flex items-center gap-4 text-left">
            <div
              class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
            >
              <Icon name="lucide:utensils" class="h-5 w-5 text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-medium truncate">{{ meal.name }}</p>
                <Badge variant="secondary" class="rounded-full text-xs">
                  {{ mealTypeLabels[meal.mealType] }}
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground">
                {{ formatDate(meal.date) }}
              </p>
            </div>
            <div class="text-right shrink-0 mr-4">
              <p class="font-medium">{{ Number(meal.price).toFixed(2) }} €</p>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div class="pb-4 pt-2 space-y-4">
            <!-- Datalist style details -->
            <div class="grid gap-3 text-sm">
              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">Type</span>
                <span class="font-medium">{{
                  mealTypeLabels[meal.mealType]
                }}</span>
              </div>

              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">Date</span>
                <span class="font-medium">{{ formatDate(meal.date) }}</span>
              </div>

              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">Prix</span>
                <span class="font-medium"
                  >{{ Number(meal.price).toFixed(2) }} €</span
                >
              </div>

              <div v-if="meal.description" class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0"
                  >Description</span
                >
                <span class="text-foreground">{{ meal.description }}</span>
              </div>

              <div
                v-if="meal.options && meal.options.length > 0"
                class="flex items-start gap-8"
              >
                <span class="text-muted-foreground w-24 shrink-0">Options</span>
                <div class="flex flex-wrap gap-1">
                  <Badge
                    v-for="opt in meal.options"
                    :key="opt.id"
                    variant="outline"
                    class="rounded-full text-xs"
                  >
                    {{ opt.name }}
                  </Badge>
                </div>
              </div>

              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">ID</span>
                <div class="flex items-center gap-2">
                  <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                    >{{ meal.id.slice(0, 8) }}...</code
                  >
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6"
                    @click.stop="window.navigator.clipboard.writeText(meal.id)"
                  >
                    <Icon name="lucide:copy" class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <Separator />
            <div class="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                class="rounded-full"
                @click="router.push(`/admin/repas/${meal.id}`)"
              >
                <Icon name="lucide:settings" class="mr-2 h-4 w-4" />
                Gérer les options
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full"
                @click="emit('edit', meal)"
              >
                <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="rounded-full text-destructive hover:text-destructive"
                @click="emit('delete', meal)"
              >
                <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
