export default defineEventHandler(async (event) => {
  const sessionUser = await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Order ID is required",
    });
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { id: true, orderNumber: true, registrationId: true },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Order not found",
    });
  }

  await prisma.order.delete({ where: { id } });

  logAudit("order.deleted", "Order", id, sessionUser.id, {
    orderNumber: existing.orderNumber,
    registrationId: existing.registrationId,
  });

  return { success: true };
});
