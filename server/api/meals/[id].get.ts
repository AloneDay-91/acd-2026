export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Meal ID is required",
    });
  }

  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!meal) {
    throw createError({
      statusCode: 404,
      statusMessage: "Meal not found",
    });
  }

  return meal;
});
