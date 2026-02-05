export default defineEventHandler(async (event) => {
  const optionId = getRouterParam(event, "optionId");

  if (!optionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Option ID is required",
    });
  }

  await prisma.mealOption.delete({
    where: { id: optionId },
  });

  return { success: true };
});
