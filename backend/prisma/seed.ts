import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Food', icon: 'utensils', color: '#F97316' },
  { name: 'Transport', icon: 'car', color: '#3B82F6' },
  { name: 'Entertainment', icon: 'film', color: '#8B5CF6' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#EC4899' },
  { name: 'Bills', icon: 'receipt', color: '#EF4444' },
  { name: 'Health', icon: 'heart', color: '#10B981' },
  { name: 'Others', icon: 'more-horizontal', color: '#6B7280' },
];

async function main() {
  console.log('Seeding default categories...');

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: category.name,
          userId: null,
        },
      },
      update: {},
      create: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: true,
        userId: null,
      },
    });
  }

  console.log('Default categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
