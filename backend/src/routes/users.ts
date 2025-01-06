import { Router } from "express";
import { prisma } from "../lib/db.js";
import { z } from "zod";

export const usersRouter = Router();

export const queryStringSchema = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
});

usersRouter.get("/", async (req, res) => {
  const validationResponse = queryStringSchema.safeParse(req.query);
  if (!validationResponse.success) {
    res.status(400).end();
    return;
  }

  const { data } = validationResponse;
  const { page = 1, size = 10 } = data;

  const [results, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        name: true,
        paternalLastName: true,
        maternalLastName: true,
      },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.user.count(),
  ]);

  res.json({
    results,
    page,
    totalCount,
  });
});

usersRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).end();
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      email: true,
      userType: true,
      name: true,
      paternalLastName: true,
      maternalLastName: true,
    },
  });
  if (!user) {
    res.status(404).end();
    return;
  }

  res.json(user);
});

const updateUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  userType: z.enum(["USER", "ADMIN"]),
  name: z.string(),
  paternalLastName: z.string(),
  maternalLastName: z.string(),
});

usersRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).end();
    return;
  }

  const validationResponse = updateUserSchema.safeParse(req.body);
  if (!validationResponse.success) {
    res.status(400).end();
    return;
  }

  const { data } = validationResponse;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: data,
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        name: true,
        paternalLastName: true,
        maternalLastName: true,
      },
    });

    res.json(updatedUser);
    return;
  } catch (error) {
    res.status(500).end();
    return;
  }
});

usersRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).end();
    return;
  }

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.status(200).end();
    return;
  } catch (error) {
    res.status(500).end();
    return;
  }
});
