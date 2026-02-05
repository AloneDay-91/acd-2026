export default defineEventHandler(async () => {
  const meals = await prisma.meal.findMany({
    include: {
      options: true,
    },
    orderBy: { date: "asc" },
  });
  return meals;
});
