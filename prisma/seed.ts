import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'antonella@example.com',
      name: 'Antonella',
    },
  })

  await prisma.user.create({
    data: {
      email: 'facundo@example.com',
      name: 'Facundo',
    },
  })

  await prisma.user.create({
    data: {
      email: 'ramiro@example.com',
      name: 'Ramiro',
    },
  })

  await prisma.user.create({
    data: {
      email: 'groucho@example.com',
      name: 'Groucho',
    },
  })

  await prisma.user.create({
    data: {
      email: 'conan@example.com',
      name: 'conan',
    },
  })
}

try {
  await main()
  await prisma.$disconnect()
} catch (error) {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
}
