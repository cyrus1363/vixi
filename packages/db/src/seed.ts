import { prisma } from "./client";
import { hash } from "bcryptjs";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "demo@vixi.app" },
  });

  if (!existing) {
    const password = await hash("demo1234", 12);
    const user = await prisma.user.create({
      data: {
        email: "demo@vixi.app",
        name: "Demo User",
        password,
      },
    });

    await prisma.vault.create({
      data: {
        userId: user.id,
        name: "My First Vault",
        description: "Important documents and notes",
        type: "GENERAL",
        contents: {
          create: [
            {
              contentType: "note",
              title: "Welcome to Vixi",
              body: "This is your secure vault. Store important information here for your beneficiaries.",
            },
          ],
        },
      },
    });

    await prisma.beneficiary.create({
      data: {
        userId: user.id,
        name: "Jane Doe",
        email: "jane@example.com",
        relationship: "Spouse",
        trusted: true,
      },
    });

    await prisma.memory.create({
      data: {
        userId: user.id,
        title: "A cherished memory",
        body: "Write your memories here to preserve them for future generations.",
        tags: ["welcome"],
      },
    });

    console.log("✅ Seed data created: demo@vixi.app / demo1234");
  } else {
    console.log("ℹ️ Demo user already exists, skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
