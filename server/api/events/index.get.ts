export default defineEventHandler(async () => {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });
  return events;
});
