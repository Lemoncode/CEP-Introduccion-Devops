import { PrismaClient } from "../src/prisma/client";
import recipes from "./recipes.json" with { type: "json" };

const prisma = new PrismaClient();

await prisma.recipes.createMany({ data: recipes });
await prisma.$disconnect();
