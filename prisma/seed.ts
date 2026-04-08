import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const employeePassword = await bcrypt.hash('Employee@123', 12)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@voltex.com' },
    update: {},
    create: {
      email: 'admin@voltex.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Employee Users
  const employee1 = await prisma.user.upsert({
    where: { email: 'john.doe@voltex.com' },
    update: {},
    create: {
      email: 'john.doe@voltex.com',
      name: 'John Doe',
      password: employeePassword,
      role: 'EMPLOYEE',
    },
  })

  const employee2 = await prisma.user.upsert({
    where: { email: 'jane.smith@voltex.com' },
    update: {},
    create: {
      email: 'jane.smith@voltex.com',
      name: 'Jane Smith',
      password: employeePassword,
      role: 'EMPLOYEE',
    },
  })
  console.log('✅ Employee users created')

  // Create Employee records
  await prisma.employee.upsert({
    where: { userId: employee1.id },
    update: {},
    create: {
      userId: employee1.id,
      department: 'Sales',
      target: 50000,
    },
  })

  await prisma.employee.upsert({
    where: { userId: employee2.id },
    update: {},
    create: {
      userId: employee2.id,
      department: 'Inventory',
      target: 30000,
    },
  })
  console.log('✅ Employee records created')


  // Create Sample Products with REAL ASSETS
  const products = [
    {
      name: 'VOLTEX NEXUS-16',
      slug: 'voltex-nexus-16',
      description: 'The ultimate powerhouse for professionals. Featuring M4 Pro chip, 32GB RAM, and RTX 4090 GPU for unmatched performance.',
      price: 3499.00,
      stock: 15,
      category: 'Gaming',
      specs: {
        processor: 'M4 Pro Chip',
        ram: '32GB DDR5',
        storage: '2TB NVMe SSD',
        gpu: 'RTX 4090',
        display: '16" 4K OLED',
        battery: '22 hours',
        weight: '2.1kg',
      },
      images: ['/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'],
      modelUrl: '/models/laptop-1.glb',
      isActive: true,
    },
    {
      name: 'VOLTEX AER-14',
      slug: 'voltex-aer-14',
      description: 'Ultra-slim design meets powerful performance. Perfect for creators on the go.',
      price: 2199.00,
      stock: 20,
      category: 'Ultrabook',
      specs: {
        processor: 'Intel Core i7-13700H',
        ram: '16GB LPDDR5',
        storage: '1TB NVMe SSD',
        gpu: 'Intel Iris Xe',
        display: '14" 2.8K OLED',
        battery: '18 hours',
        weight: '1.2kg',
      },
      images: ['/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg'],
      modelUrl: '/models/laptop-2.glb',
      isActive: true,
    },
    {
      name: 'VOLTEX STUDIO PRO',
      slug: 'voltex-studio-pro',
      description: 'Built for creative professionals. Exceptional color accuracy and processing power.',
      price: 3899.00,
      stock: 10,
      category: 'Creator',
      specs: {
        processor: 'AMD Ryzen 9 7945HX',
        ram: '64GB DDR5',
        storage: '4TB NVMe SSD',
        gpu: 'RTX 4080',
        display: '16" 4K Mini-LED',
        battery: '15 hours',
        weight: '2.3kg',
      },
      images: ['/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg'],
      modelUrl: '/models/laptop-3.glb',
      isActive: true,
    },
    {
      name: 'VOLTEX CORE M1',
      slug: 'voltex-core-m1',
      description: 'Affordable performance for everyday computing. Perfect for students and professionals.',
      price: 1599.00,
      stock: 30,
      category: 'Ultrabook',
      specs: {
        processor: 'Apple M1',
        ram: '8GB Unified Memory',
        storage: '512GB SSD',
        gpu: 'Apple M1 8-core GPU',
        display: '13.3" Retina',
        battery: '20 hours',
        weight: '1.3kg',
      },
      images: ['/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg'],
      modelUrl: '/models/laptop-4.glb',
      isActive: true,
    },
    {
      name: 'VOLTEX TITAN X',
      slug: 'voltex-titan-x',
      description: 'The beast for gaming enthusiasts. Maximum performance, zero compromises.',
      price: 4299.00,
      stock: 8,
      category: 'Gaming',
      specs: {
        processor: 'Intel Core i9-13980HX',
        ram: '64GB DDR5',
        storage: '2TB NVMe SSD',
        gpu: 'RTX 4090 Mobile',
        display: '17.3" 4K 144Hz',
        battery: '12 hours',
        weight: '3.2kg',
      },
      images: ['/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg'],
      modelUrl: '/models/laptop-2.glb',
      isActive: true,
    },
    {
      name: 'VOLTEX SWIFT 13',
      slug: 'voltex-swift-13',
      description: 'Lightweight champion. Maximum portability without sacrificing performance.',
      price: 1899.00,
      stock: 25,
      category: 'Ultrabook',
      specs: {
        processor: 'Intel Core i5-1340P',
        ram: '16GB LPDDR5',
        storage: '512GB NVMe SSD',
        gpu: 'Intel Iris Xe',
        display: '13.3" FHD IPS',
        battery: '16 hours',
        weight: '0.99kg',
      },
      images: ['/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'],
      modelUrl: '/models/laptop-3.glb',
      isActive: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('✅ 6 sample products created')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
