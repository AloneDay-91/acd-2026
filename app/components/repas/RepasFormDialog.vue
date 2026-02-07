<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { toast } from "vue-sonner";

interface MealData {
  id?: string;
  name: string;
  description?: string | null;
  date: Date | string;
  mealType: "LUNCH" | "DINNER";
  price: number | string;
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
const isEditMode = computed(() => !!props.meal?.id);
const datePickerOpen = ref(false);

// Form state
const formData = ref({
  name: "",
  description: "",
  date: today(getLocalTimeZone()) as DateValue,
  mealType: "LUNCH" as "LUNCH" | "DINNER",
  price: "0",
});

// Convert JS Date to CalendarDate
function toCalendarDate(date: Date | string): DateValue {
  const d = new Date(date);
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

// Reset form when dialog opens/closes or meal changes
watch(
  () => [props.open, props.meal],
  () => {
    if (props.open && props.meal) {
      formData.value = {
        name: props.meal.name,
        description: props.meal.description || "",
        date: toCalendarDate(props.meal.date),
        mealType: props.meal.mealType,
        price: String(props.meal.price),
      };
    } else if (props.open && !props.meal) {
      formData.value = {
        name: "",
        description: "",
        date: today(getLocalTimeZone()),
        mealType: "LUNCH",
        price: "0",
      };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  if (!formData.value.name || !formData.value.date) {
    toast.error("Veuillez remplir tous les champs obligatoires");
    return;
  }

  isLoading.value = true;

  try {
    const dateValue = formData.value.date.toDate(getLocalTimeZone());

    if (isEditMode.value && props.meal?.id) {
      await $fetch(`/api/meals/${props.meal.id}`, {
        method: "PUT",
        body: {
          name: formData.value.name,
          description: formData.value.description || null,
          date: dateValue,
          mealType: formData.value.mealType,
          price: parseFloat(formData.value.price) || 0,
        },
      });
      toast.success("Repas modifié avec succès");
    } else {
      await $fetch("/api/meals", {
        method: "POST",
        body: {
          name: formData.value.name,
          description: formData.value.description || null,
          date: dateValue,
          mealType: formData.value.mealType,
          price: parseFloat(formData.value.price) || 0,
        },
      });
      toast.success("Repas créé avec succès");
    }

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
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? "Modifier le repas" : "Nouveau repas" }}
        </DialogTitle>
        <DialogDescription>
          {{
            isEditMode
              ? "Modifiez les informations du repas"
              : "Ajoutez un nouveau repas"
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Nom *</Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="Repas du midi"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Description du repas..."
            rows="3"
          />
        </div>

        <div class="flex gap-4">
          <!-- Date picker -->
          <div class="flex flex-col gap-2 flex-1">
            <Label class="px-1">Date *</Label>
            <Popover v-model:open="datePickerOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-between font-normal"
                >
                  {{
                    formData.date
                      ? formData.date
                          .toDate(getLocalTimeZone())
                          .toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                      : "Sélectionner"
                  }}
                  <Icon name="lucide:chevron-down" class="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  :model-value="formData.date"
                  @update:model-value="
                    (value) => {
                      if (value) {
                        formData.date = value;
                        datePickerOpen = false;
                      }
                    }
                  "
                />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Meal type -->
          <div class="flex flex-col gap-2">
            <Label class="px-1">Type *</Label>
            <Select v-model="formData.mealType">
              <SelectTrigger class="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LUNCH">Déjeuner</SelectItem>
                <SelectItem value="DINNER">Dîner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="price">Prix (€)</Label>
          <Input
            id="price"
            v-model="formData.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="emit('update:open', false)"
            :disabled="isLoading"
          >
            Annuler
          </Button>
          <Button type="submit" :disabled="isLoading">
            <Icon
              v-if="isLoading"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isEditMode ? "Enregistrer" : "Créer" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
