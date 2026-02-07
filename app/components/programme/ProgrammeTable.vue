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
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}
</script>

<template>
  <Card class="rounded-2xl">
    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead>Événement</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Horaires</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="event in events"
            :key="event.id"
            class="cursor-pointer"
          >
            <TableCell>
              <div>
                <p class="font-medium">{{ event.title }}</p>
                <p
                  v-if="event.description"
                  class="text-sm text-muted-foreground line-clamp-1"
                >
                  {{ event.description }}
                </p>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatDate(event.date) }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatTime(event.startTime, event.endTime) }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ event.location || "—" }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8"
                  @click="emit('edit', event)"
                >
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-destructive"
                  @click="emit('delete', event)"
                >
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="events.length === 0">
            <TableCell colspan="5" class="text-center py-12">
              <Icon
                name="lucide:calendar-x"
                class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4"
              />
              <p class="text-muted-foreground">
                Aucun événement dans le programme
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
