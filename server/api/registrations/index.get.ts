export default defineEventHandler(async () => {
  const registrations = await prisma.registration.findMany({
    include: {
      meals: {
        include: {
          meal: true,
          starterOption: true,
          mainOption: true,
          dessertOption: true,
        },
      },
      activities: {
        include: {
          activity: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return registrations;
});
