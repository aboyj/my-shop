import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Load environment variables from .env.local
config({ path: resolve('.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = [
    { name: 'Canva Templates', slug: 'canva-templates' },
    { name: 'UI Kits', slug: 'ui-kits' },
    { name: 'Presentations', slug: 'presentations' },
    { name: 'Icons & Illustrations', slug: 'icons-illustrations' },
    { name: 'Fonts & Typography', slug: 'fonts-typography' },
    { name: 'Web Design Templates', slug: 'web-templates' },
    { name: 'Social Media Assets', slug: 'social-media' },
    { name: 'Branding Kits', slug: 'branding-kits' },
    { name: 'Photography Presets', slug: 'photography-presets' },
    { name: 'Video Templates', slug: 'video-templates' },
    { name: 'Mockups', slug: 'mockups' },
    { name: 'Tutorials & Courses', slug: 'tutorials' },
  ];

  // Clear existing categories first
  await prisma.category.deleteMany({});

  const createdCategories = await Promise.all(
    categories.map((cat) => prisma.category.create({ data: cat }))
  );

  console.log(`✅ Created ${createdCategories.length} categories`);

  // Create sample user
  const hashedPassword = await hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: 'Premium Designer',
      password: hashedPassword,
      role: 'seller',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample products
  const products = [
    {
      title: 'Modern UI Kit - Complete Design System',
      description:
        'A comprehensive UI kit with 500+ components, ready for Figma. Includes buttons, forms, cards, modals, and more.',
      price: 49.99,
      category: createdCategories[1], // UI Kits
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['UI', 'Figma', 'Design System'],
    },
    {
      title: 'Social Media Templates Bundle',
      description: '50 premium social media templates for Instagram, Facebook, and TikTok. Fully editable in Canva.',
      price: 29.99,
      category: createdCategories[0], // Canva Templates
      images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop'],
      tags: ['Social Media', 'Canva', 'Templates'],
    },
    {
      title: 'Business Presentation Template',
      description:
        '30-slide professional presentation template with custom fonts, colors, and layouts. Perfect for pitches.',
      price: 24.99,
      category: createdCategories[2], // Presentations
      images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop'],
      tags: ['Presentation', 'Business', 'PowerPoint'],
    },
    {
      title: 'Icon Pack - 1000+ Premium Icons',
      description:
        '1000+ hand-crafted icons in multiple styles (Line, Solid, Filled). Available in SVG and PNG formats.',
      price: 39.99,
      category: createdCategories[3], // Icons & Illustrations
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Icons', 'Vector', 'SVG'],
    },
    {
      title: 'Typography Bundle - 50 Premium Fonts',
      description: 'Collection of 50 high-quality fonts perfect for headings, body text, and display. OTF and TTF formats.',
      price: 44.99,
      category: createdCategories[4], // Fonts
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Fonts', 'Typography', 'Design'],
    },
    {
      title: 'Website Landing Page Template',
      description:
        'Modern, responsive landing page template built with HTML/CSS/JS. Fully customizable and SEO optimized.',
      price: 34.99,
      category: createdCategories[5], // Web Templates
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Web Design', 'HTML', 'Responsive'],
    },
    {
      title: 'Instagram Stories Template Pack',
      description: '100 unique Instagram story templates. Easily customizable in Canva. New designs every month.',
      price: 19.99,
      category: createdCategories[6], // Social Media
      images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop'],
      tags: ['Instagram', 'Stories', 'Social'],
    },
    {
      title: 'Complete Branding Kit',
      description: 'Full branding package including logo, color palette, typography guidelines, and brand assets.',
      price: 79.99,
      category: createdCategories[7], // Branding Kits
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Branding', 'Logo', 'Brand Identity'],
    },
    {
      title: 'Photography Presets Bundle',
      description:
        '20 professional photography presets for Lightroom. Perfect for Instagram, portraits, and landscape photography.',
      price: 29.99,
      category: createdCategories[8], // Photography
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Photography', 'Lightroom', 'Presets'],
    },
    {
      title: 'Video Intro Templates - 4K',
      description: 'Professional 4K video intro templates for YouTube, TikTok, and social media. Editable in Premiere Pro.',
      price: 54.99,
      category: createdCategories[9], // Video
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Video', '4K', 'Templates'],
    },
    {
      title: 'Product Mockup Pack',
      description:
        '50+ professional product mockups for packaging, phones, laptops, and more. PSD files fully editable.',
      price: 34.99,
      category: createdCategories[10], // Mockups
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Mockups', 'PSD', 'Product'],
    },
    {
      title: 'Design Fundamentals Course',
      description:
        'Comprehensive course covering design principles, color theory, typography, and UX/UI. 10+ hours of content.',
      price: 99.99,
      category: createdCategories[11], // Tutorials
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'],
      tags: ['Course', 'Tutorial', 'Learning'],
    },
  ];

  const createdProducts = [];
  for (const prod of products) {
    const product = await prisma.product.create({
      data: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        slug: prod.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        status: 'active',
        authorId: user.id,
        categoryId: prod.category.id,
        images: {
          create: prod.images.map((url) => ({ url })),
        },
        tags: {
          connectOrCreate: prod.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
    createdProducts.push(product);
  }

  console.log(`✅ Created ${createdProducts.length} products`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
