import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =====================================================
  // CATEGORIES
  // =====================================================
  const categories = [
    { name: "Concert", slug: "concert", icon: "🎵" },
    { name: "Gala", slug: "gala", icon: "🎉" },
    { name: "Conférence", slug: "conference", icon: "🎤" },
    { name: "Sport", slug: "sport", icon: "⚽" },
    { name: "Culture", slug: "culture", icon: "🎭" },
    { name: "Formation", slug: "formation", icon: "📚" },
    { name: "Soirée", slug: "soiree", icon: "🌙" },
    { name: "Autre", slug: "autre", icon: "📌" },
  ];

  for (const category of categories) {
    await prisma.eventCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✅ ${categories.length} catégories créées`);

  // =====================================================
  // ADMIN USER
  // =====================================================
  const hashedPassword = await bcrypt.hash("Admin@Univibes2026!", 12);

  await prisma.user.upsert({
    where: { email: "admin@univibes.com" },
    update: {},
    create: {
      email: "admin@univibes.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      profile: {
        create: {
          fullname: "Admin Univibes",
          city: "Cotonou",
        },
      },
    },
  });
  console.log("✅ Compte admin → admin@univibes.com / Admin@Univibes2026!");

  console.log("\n🎉 Seed terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
