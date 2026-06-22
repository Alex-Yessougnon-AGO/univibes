import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";

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

  // =====================================================
  // ORGANIZER & SAMPLE EVENT
  // =====================================================
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@univibes.com" },
  });

  if (adminUser) {
    const organizer = await prisma.organizer.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        organizationName: "Univibes Officiel",
        verified: true,
      },
    });
    console.log("✅ Organisateur créé → Univibes Officiel");

    const concertCategory = await prisma.eventCategory.findUnique({
      where: { slug: "concert" },
    });

    if (concertCategory) {
      await prisma.event.upsert({
        where: { slug: "soiree-de-rentree-univibes-2026" },
        update: {},
        create: {
          organizerId: organizer.id,
          categoryId: concertCategory.id,
          title: "Soirée de rentrée Univibes 2026",
          slug: "soiree-de-rentree-univibes-2026",
          description:
            "Venez célébrer la rentrée universitaire 2026 avec nous ! Au programme : concerts, animations et rencontres. Un événement à ne pas manquer pour tous les étudiants de Cotonou.",
          location: "Campus UAC, Abomey-Calavi",
          city: "Cotonou",
          startDate: new Date("2026-10-15T18:00:00Z"),
          endDate: new Date("2026-10-15T23:59:00Z"),
          status: "approved",
          isFree: true,
          views: 42,
        },
      });
      console.log("✅ Événement créé → Soirée de rentrée Univibes 2026");
    }
  }

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
