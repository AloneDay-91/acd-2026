export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields
  if (!body.title || !body.date || !body.startTime || !body.endTime) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: title, date, startTime, endTime",
    });
  }

  const newEvent = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description || null,
      date: new Date(body.date),
      startTime: body.startTime,
      endTime: body.endTime,
      location: body.location || null,
    },
  });

  return newEvent;
});
