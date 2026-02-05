<script setup lang="ts">
import { toast } from "vue-sonner";

interface HotelData {
  id?: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  websiteUrl?: string | null;
  phone?: string | null;
  email?: string | null;
}

const props = defineProps<{
  open: boolean;
  hotel?: HotelData | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isLoading = ref(false);
const isEditMode = computed(() => !!props.hotel?.id);

// Form state
const formData = ref({
  name: "",
  address: "",
  postalCode: "",
  city: "",
  googleMapsUrl: "",
  websiteUrl: "",
  phone: "",
  email: "",
  latitude: "",
  longitude: "",
});

// Reset form when dialog opens/closes or hotel changes
watch(
  () => [props.open, props.hotel],
  () => {
    if (props.open && props.hotel) {
      formData.value = {
        name: props.hotel.name,
        address: props.hotel.address,
        postalCode: props.hotel.postalCode,
        city: props.hotel.city,
        googleMapsUrl: props.hotel.googleMapsUrl || "",
        websiteUrl: props.hotel.websiteUrl || "",
        phone: props.hotel.phone || "",
        email: props.hotel.email || "",
        latitude: props.hotel.latitude ? String(props.hotel.latitude) : "",
        longitude: props.hotel.longitude ? String(props.hotel.longitude) : "",
      };
    } else if (props.open && !props.hotel) {
      formData.value = {
        name: "",
        address: "",
        postalCode: "",
        city: "",
        googleMapsUrl: "",
        websiteUrl: "",
        phone: "",
        email: "",
        latitude: "",
        longitude: "",
      };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  if (
    !formData.value.name ||
    !formData.value.address ||
    !formData.value.postalCode ||
    !formData.value.city
  ) {
    toast.error(
      "Veuillez remplir les champs obligatoires (Nom, Adresse, CP, Ville)",
    );
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      name: formData.value.name,
      address: formData.value.address,
      postalCode: formData.value.postalCode,
      city: formData.value.city,
      googleMapsUrl: formData.value.googleMapsUrl || null,
      websiteUrl: formData.value.websiteUrl || null,
      phone: formData.value.phone || null,
      email: formData.value.email || null,
      latitude: formData.value.latitude
        ? parseFloat(formData.value.latitude)
        : null,
      longitude: formData.value.longitude
        ? parseFloat(formData.value.longitude)
        : null,
    };

    if (isEditMode.value && props.hotel?.id) {
      await $fetch(`/api/hotels/${props.hotel.id}`, {
        method: "PUT",
        body: payload,
      });
      toast.success("Hôtel modifié avec succès");
    } else {
      await $fetch("/api/hotels", {
        method: "POST",
        body: payload,
      });
      toast.success("Hôtel créé avec succès");
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
    <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? "Modifier l'hôtel" : "Ajouter un hôtel" }}
        </DialogTitle>
        <DialogDescription>
          {{
            isEditMode
              ? "Modifiez les informations de l'hôtel partenaire"
              : "Ajoutez un nouveau partenaire hôtelier"
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Informations générales -->
        <div class="space-y-4">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Général
          </h3>
          <div class="space-y-2">
            <Label for="name">Nom de l'établissement *</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Hôtel de Paris..."
              required
            />
          </div>
        </div>

        <Separator />

        <!-- Adresse -->
        <div class="space-y-4">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Adresse
          </h3>
          <div class="space-y-2">
            <Label for="address">Rue *</Label>
            <Input
              id="address"
              v-model="formData.address"
              placeholder="12 rue de la République"
              required
            />
          </div>
          <div class="flex gap-4">
            <div class="space-y-2 flex-1">
              <Label for="postalCode">Code Postal *</Label>
              <Input
                id="postalCode"
                v-model="formData.postalCode"
                placeholder="75001"
                required
              />
            </div>
            <div class="space-y-2 flex-[2]">
              <Label for="city">Ville *</Label>
              <Input
                id="city"
                v-model="formData.city"
                placeholder="Paris"
                required
              />
            </div>
          </div>
          <div class="flex gap-4">
            <div class="space-y-2 flex-1">
              <Label for="latitude">Latitude</Label>
              <Input
                id="latitude"
                v-model="formData.latitude"
                placeholder="48.8566"
                type="number"
                step="any"
              />
            </div>
            <div class="space-y-2 flex-1">
              <Label for="longitude">Longitude</Label>
              <Input
                id="longitude"
                v-model="formData.longitude"
                placeholder="2.3522"
                type="number"
                step="any"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="googleMapsUrl">Lien Google Maps</Label>
            <Input
              id="googleMapsUrl"
              v-model="formData.googleMapsUrl"
              placeholder="https://goo.gl/maps/..."
            />
          </div>
        </div>

        <Separator />

        <!-- Contact -->
        <div class="space-y-4">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Contact
          </h3>
          <div class="flex gap-4">
            <div class="space-y-2 flex-1">
              <Label for="phone">Téléphone</Label>
              <Input
                id="phone"
                v-model="formData.phone"
                placeholder="01 23 45 67 89"
              />
            </div>
            <div class="space-y-2 flex-1">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="formData.email"
                placeholder="contact@hotel.com"
                type="email"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="websiteUrl">Site Web</Label>
            <Input
              id="websiteUrl"
              v-model="formData.websiteUrl"
              placeholder="https://www.hotel.com"
            />
          </div>
        </div>

        <DialogFooter class="pt-4">
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
