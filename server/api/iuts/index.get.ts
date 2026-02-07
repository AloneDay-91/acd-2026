export default defineEventHandler(async (event) => {
  try {
    const iuts = await prisma.iut.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return iuts;
  } catch (error) {
    console.error("Error fetching IUTs:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des IUTs",
    });
  }
});
