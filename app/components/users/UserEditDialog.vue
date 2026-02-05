<script setup lang="ts">
import { z } from "zod";
import { toast } from "vue-sonner";
import { authClient } from "@/lib/auth-client";

const props = defineProps<{
  open: boolean;
  user: any;
}>();

const emit = defineEmits(["update:open", "success"]);

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  tel: z.string().optional(),
  role: z.string(),
});

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  tel: "",
  iut: "",
  role: "user",
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);
const iuts = ref<any[]>([]);

onMounted(async () => {
  try {
    iuts.value = (await $fetch("/api/iuts")) || [];
  } catch (e) {
    console.error("Failed to load IUTs", e);
  }
});

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        firstName: newUser.firstName || "",
        lastName: newUser.lastName || "",
        email: newUser.email || "",
        tel: newUser.tel || "",
        iut: newUser.iut || "",
        role: newUser.role || "user",
      };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  const result = formSchema.safeParse(formData.value);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors as any;
    return;
  }

  isLoading.value = true;
  errors.value = {};

  try {
    // Update profile
    await $fetch(`/api/users/${props.user.id}`, {
      method: "PUT",
      body: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        tel: formData.value.tel,
        iut: formData.value.iut,
      },
    });

    // Update role
    // Check if role changed to avoid unnecessary API call
    if (formData.value.role !== props.user.role) {
      const { error } = await authClient.admin.setRole({
        userId: props.user.id,
        role: formData.value.role,
      });
      if (error) {
        toast.error("Erreur lors de la mise à jour du rôle: " + error.message);
      }
    }

    toast.success("Utilisateur mis à jour avec succès");
    emit("success");
    emit("update:open", false);
  } catch (error: any) {
    console.error(error);
    toast.error("Une erreur est survenue lors de la mise à jour");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogDescription>
          Modifiez les informations et le rôle de l'utilisateur.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName">Prénom</Label>
            <Input
              id="firstName"
              v-model="formData.firstName"
              placeholder="Prénom"
            />
            <span v-if="errors.firstName" class="text-sm text-destructive">{{
              errors.firstName
            }}</span>
          </div>
          <div class="space-y-2">
            <Label for="lastName">Nom</Label>
            <Input
              id="lastName"
              v-model="formData.lastName"
              placeholder="Nom"
            />
            <span v-if="errors.lastName" class="text-sm text-destructive">{{
              errors.lastName
            }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            v-model="formData.email"
            placeholder="exemple@email.com"
          />
          <span v-if="errors.email" class="text-sm text-destructive">{{
            errors.email
          }}</span>
        </div>

        <div class="space-y-2">
          <Label for="tel">Téléphone</Label>
          <Input
            id="tel"
            type="tel"
            v-model="formData.tel"
            placeholder="06 12 34 56 78"
          />
          <span v-if="errors.tel" class="text-sm text-destructive">{{
            errors.tel
          }}</span>
        </div>

        <div class="space-y-2">
          <Label for="iut">IUT de rattachement</Label>
          <Select v-model="formData.iut">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un IUT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="iut in iuts" :key="iut.id" :value="iut.name">
                {{ iut.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <span v-if="errors.iut" class="text-sm text-destructive">{{
            errors.iut
          }}</span>
        </div>

        <div class="space-y-2">
          <Label for="role">Rôle</Label>
          <Select v-model="formData.role">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Utilisateur</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          <span v-if="errors.role" class="text-sm text-destructive">{{
            errors.role
          }}</span>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="$emit('update:open', false)"
          >
            Annuler
          </Button>
          <Button type="submit" :disabled="isLoading">
            <Icon
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
              v-if="isLoading"
            />
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
