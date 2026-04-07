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


  // Create Sample Products
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCt12GKDQMv_lvbCVHwB53awSuuutPCcX2dUbigZcLgYT0AmISsmlObhH3u83FgcAjTJ5_vrlCOi4mHGAYvE8GYwaK4r1dUwBElMXWhY-jR-gjVO7ZWC7MAY6M0EzEhMj_etqpo2VlNZZcwpdL8eJbMqIOec7oZ1ubY632Xa5yHUkePRQw518GcfGqsfNl9Hz0lQARKWPEhKdwHiAcgFUWKjmsV1CsC5YuiSE40xCoC3Ev6ub4DNjx2IFoV4ObMVeds6K_wnLyU4',
      ],
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDPb10p1bX2aoGmc5P5JnJNyCYGsMndNsShl8LFAIHQXfbgLG2Ocw8ZkTFZEC_eqwUxt_9QaEOc1ocir5y55_vldjp3uDOgvI8FgcYcsH1ICJFXvpur_sKz9na_0T8FKKZ7e0pDyzyhzThLXp2aY2lrbmRSnx6oSvCyO4JnUxPYBkyYG0YCg-guS8ShaGsVLqFKj0GD-TPP4rkzeL38L_cCkDAQOBdMU7aQ2KhN8Y7bf7p30Vva51S3TNlB4qBW7fy3NYewkcIMo80',
      ],
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCfBzOCP2vn68Kpdjy6jLAVHecJua8WBUvzklJYaG92hQxA2fqCtDAU61_tg2VrF-lJ-bbBQH0B5SSjgIlNQoNc0c19LTZ2NMLPOBbPwqLDCMPcqLyYbrOLnF90I0ILbzcUGthDf_gcrndrylal0zY5dmXhB2eeokt_SiEKekybtFEiFjkGM_L4lFzIErjiPdbf4jo3U7ODurXKwLQ6PzEhtiHnEor2bwnBDmVMHMyqZho_lXE741hnVR_RdQw_vdvF4_1kjXxy6sc',
      ],
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyI7-ImuvhirKSEp_Vdab-LR-cjS8eB7c5bcILrZs4QFmkCO2-C99wqjOYFbasP3GgZ3HTsKVKPfgGAMBsoxmVDGsA2DIGuffo6IpRuHhS5e5pk06XWIt7_jZdqy969o-UIPIoaGFSJEUqbmiM4_ZiZvnYvyNmY-32C-RBV3OMsP6SQ_8KnUbDsk75w2S_PRnHSMIgvnCVD7dzo7jZRwDxrsG8oh7CoON_LRI9KeHU-jB7zIXhDOxHB83KbaJdjy_74M3RPMhr-7U',
      ],
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4FTy9rsIL-5ecgUVc7VHSAbKAnV864xzenOi0KMYnpctjRpA0nGWA_xGdkOPrDl4Fpq2Pms98KyACbg2t7j4xKtwFI6b-XHi1NLD2FjKsJeiSLaUs0sRQuIHjLWPIcaA-qHQxOTwDeQlHqtwm-E62lBbObd-6D9Hh_EYuoCHy984BuimQqkNyHhcPKPDB07ch9s3Gqp04oQ0voDNXI3_r2JZDxWXxmdzpqTuIJo8LbK-LLsKUUHsiSZDanfb9einBbtBjtZ03vZ4',
      ],
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
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCD3E7-X0aLPyHv9bJHTkos5IdsnhBjvVIIOuefwLd2bhLVxDsOtvWVb4XFQxCeLeaKCReETi6ZLsvfwrh0-bP9ucbghlmawx9m_5r14ekgcOK-OtHTc6zcCMVpgebiNOvDwcKkyJc4kAsLLMZ4x_9pbKAJNb2CDVwIAEVPNrobqqAyUx07vrMxXuo7cbS8wg-yT1YoUq0QK7bXbl6k5cL3MwiCxs0OLLoidyDC619PwymGV7YA5DS2cvlUhwj9KAo9-SiLlqWxfLY',
      ],
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
