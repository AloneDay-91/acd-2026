export default defineEventHandler(async (event) => {
  const hotels = await prisma.hotel.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return hotels;
});
