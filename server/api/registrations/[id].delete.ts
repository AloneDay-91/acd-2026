export default defineEventHandler(async (event) => {
  const sessionUser = await requireAdmin(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Registration ID is required",
    });
  }

  const existing = await prisma.registration.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Registration not found",
    });
  }

  await prisma.registration.delete({ where: { id } });

  logAudit("registration.deleted", "Registration", id, sessionUser.id, {
    name: `${existing.firstName} ${existing.lastName}`,
    email: existing.email,
  });

  return { success: true };
});
