<script setup lang="ts">
interface EventData {
  id: string;
  title: string;
  description?: string | null;
  date: Date | string;
  startTime: string;
  endTime: string;
  location?: string | null;
}

defineProps<{
  events: EventData[];
}>();

const emit = defineEmits<{
  edit: [event: EventData];
  delete: [event: EventData];
}>();

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}
</script>

<template>
  <div class="space-y-2">
    <!-- Empty state -->
    <Card v-if="events.length === 0" class="rounded-2xl">
      <CardContent class="py-12 text-center">
        <Icon
          name="lucide:calendar-x"
          class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4"
        />
        <p class="text-muted-foreground">Aucun événement dans le programme</p>
      </CardContent>
    </Card>

    <!-- Events list with accordion -->
    <Accordion v-else type="single" collapsible class="space-y-2">
      <AccordionItem
        v-for="event in events"
        :key="event.id"
        :value="event.id"
        class="border rounded-xl bg-card px-4 data-[state=open]:bg-muted/30"
      >
        <AccordionTrigger class="hover:no-underline py-4">
          <div class="flex items-center gap-4 text-left">
            <div
              class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
            >
              <Icon name="lucide:calendar" class="h-5 w-5 text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ event.title }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatDate(event.date) }}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div class="pb-4 pt-2 space-y-4">
            <!-- Datalist style details -->
            <div class="grid gap-3 text-sm">
              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0"
                  >Horaires</span
                >
                <span class="font-medium">{{
                  formatTime(event.startTime, event.endTime)
                }}</span>
              </div>

              <div v-if="event.location" class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">Lieu</span>
                <span class="font-medium">{{ event.location }}</span>
              </div>

              <div v-if="event.description" class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0"
                  >Description</span
                >
                <span class="text-foreground">{{ event.description }}</span>
              </div>

              <div class="flex items-start gap-8">
                <span class="text-muted-foreground w-24 shrink-0">ID</span>
                <div class="flex items-center gap-2">
                  <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                    >{{ event.id.slice(0, 8) }}...</code
                  >
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6"
                    @click.stop="navigator.clipboard.writeText(event.id)"
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
                variant="outline"
                size="sm"
                class="rounded-full"
                @click="emit('edit', event)"
              >
                <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="rounded-full text-destructive hover:text-destructive"
                @click="emit('delete', event)"
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
