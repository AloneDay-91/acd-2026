export default defineEventHandler(async (event) => {
  const activities = await prisma.activity.findMany({
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          registrationActivities: true,
        },
      },
    },
  });

  return activities.map((activity) => ({
    ...activity,
    price: Number(activity.price),
    registered: activity._count.registrationActivities,
  }));
});
