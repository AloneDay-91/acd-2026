export default defineEventHandler(async () => {
  const orders = await prisma.order.findMany({
    include: {
      registration: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return orders;
});
