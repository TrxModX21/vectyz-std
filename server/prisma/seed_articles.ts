import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Vectolio articles...");

  // Get the first user to assign as author
  let author = await prisma.user.findFirst();
  if (!author) {
    author = await prisma.user.create({
      data: {
        name: "Vectolio Admin",
        email: "admin@vectolio.com",
        password: "hashed_password_placeholder", // placeholder
      },
    });
    console.log("Created dummy author.");
  } else {
    console.log(`Using author: ${author.name}`);
  }

  // Create Categories
  const categoryUI = await prisma.blogCategory.upsert({
    where: { slug: "ui-ux-design" },
    update: {},
    create: {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "Everything about modern interface and experience design.",
    },
  });

  const categoryDev = await prisma.blogCategory.upsert({
    where: { slug: "development" },
    update: {},
    create: {
      name: "Development",
      slug: "development",
      description: "Frontend, performance, and implementation guides.",
    },
  });

  const categoryCreator = await prisma.blogCategory.upsert({
    where: { slug: "creators" },
    update: {},
    create: {
      name: "Creators",
      slug: "creators",
      description: "Tips for digital creators to maximize earnings and reach.",
    },
  });

  // Create Tags
  const tagVector = await prisma.blogTag.upsert({ where: { slug: "vector" }, update: {}, create: { name: "Vector", slug: "vector" }});
  const tagTrends = await prisma.blogTag.upsert({ where: { slug: "trends" }, update: {}, create: { name: "Trends", slug: "trends" }});
  const tagPerf = await prisma.blogTag.upsert({ where: { slug: "performance" }, update: {}, create: { name: "Performance", slug: "performance" }});
  const tagSvg = await prisma.blogTag.upsert({ where: { slug: "svg" }, update: {}, create: { name: "SVG", slug: "svg" }});
  const tagMonetization = await prisma.blogTag.upsert({ where: { slug: "monetization" }, update: {}, create: { name: "Monetization", slug: "monetization" }});

  // Create Articles
  const article1 = await prisma.blogPost.upsert({
    where: { slug: "ultimate-guide-premium-vector-illustrations" },
    update: {},
    create: {
      title: "The Ultimate Guide to Premium Vector Illustrations in Modern UI Design",
      slug: "ultimate-guide-premium-vector-illustrations",
      excerpt: "Discover how high-quality vector assets are shaping modern user interfaces, and learn how to integrate glassmorphism and abstract shapes into your next project.",
      content: `
## Welcome to the Future of UI Design

In the ever-evolving world of digital design, **vector illustrations** have become a cornerstone of modern aesthetics. From landing pages to complex dashboards, vectors provide scalability, sharpness, and vibrant colors that raster images simply can't match.

### Why Vectors?

1. **Infinite Scalability:** SVG and EPS formats ensure your graphics look crisp on any screen size.
2. **Performance:** Vectors often have smaller file sizes, leading to faster load times.
3. **Versatility:** Easy to recolor, animate, and manipulate via CSS and JS.

### Trend: Glassmorphism & Abstract Shapes

One of the biggest trends this year is combining smooth, colorful abstract shapes with *glassmorphism* (frosted glass effects). At Vectolio, we've curated thousands of assets that fit this exact aesthetic. 

> "Design is not just what it looks like and feels like. Design is how it works." 

Ready to elevate your UI? Explore our premium collections today.
      `,
      coverImage: "/article-ui-design.jpg",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Guide to Vector Illustrations in UI Design | Vectolio",
      seoDescription: "Learn how to use premium vector illustrations and glassmorphism in modern UI/UX design.",
      authorId: author.id,
      categoryId: categoryUI.id,
      tags: { connect: [{ id: tagVector.id }, { id: tagTrends.id }] }
    }
  });

  const article2 = await prisma.blogPost.upsert({
    where: { slug: "optimize-svg-assets-faster-web-performance" },
    update: {},
    create: {
      title: "How to Optimize SVG Assets for Faster Web Performance",
      slug: "optimize-svg-assets-faster-web-performance",
      excerpt: "A deep dive into shrinking your SVG file sizes, cleaning up code, and ensuring your website loads blazing fast without sacrificing quality.",
      content: `
## Speed is a Feature

Every kilobyte matters when you're building a modern web application. While SVGs are generally lightweight, complex vector graphics can quickly become bloated with unnecessary metadata, hidden layers, and inefficient paths.

### 3 Steps to Optimize Your SVGs

- **Minify Your Code:** Tools like SVGO can automatically strip out comments, doctypes, and editor-specific metadata.
- **Simplify Paths:** Reducing the number of anchor points in your vector shapes can drastically reduce the file size.
- **Use SVG Sprites:** Combine multiple small icons into a single SVG sprite to reduce HTTP requests.

### Example Configuration

If you're using Webpack or Vite, make sure to add an SVG optimization plugin to your build pipeline.

\`\`\`javascript
// Example SVGO Config
module.exports = {
  plugins: [
    'removeDimensions',
    'removeViewBox',
    'cleanupIDs'
  ]
};
\`\`\`

By optimizing your assets, you not only improve SEO but also provide a significantly better user experience. Download optimized assets directly from Vectolio to save time!
      `,
      coverImage: "/article-svg-perf.jpg",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Optimize SVG Assets for Web Performance | Vectolio",
      seoDescription: "Learn how to minify and optimize SVG files to improve your website's load speed and performance.",
      authorId: author.id,
      categoryId: categoryDev.id,
      tags: { connect: [{ id: tagSvg.id }, { id: tagPerf.id }] }
    }
  });

  const article3 = await prisma.blogPost.upsert({
    where: { slug: "maximizing-earnings-digital-creator" },
    update: {},
    create: {
      title: "Maximizing Your Earnings as a Digital Creator on Vectolio",
      slug: "maximizing-earnings-digital-creator",
      excerpt: "Turn your passion into profit. Learn the best strategies for pricing, packaging, and promoting your digital assets to a global audience.",
      content: `
## Empowering Creators Worldwide

At Vectolio, our mission is to empower creators. Whether you design icons, UI kits, or complex 3D illustrations, there is a massive market of developers and agencies looking for your work.

### Strategies for Success

1. **Create Bundles:** Instead of selling individual icons, package them into themed bundles (e.g., "E-commerce Icon Pack 200+"). Bundles offer higher perceived value.
2. **Focus on Quality and Consistency:** Ensure all assets in a pack share the same line weight, color palette, and style.
3. **Write Great Descriptions:** Make sure your assets are easily searchable. Use relevant keywords, tags, and provide clear previews of the files included.

### Understanding the Analytics

Use the Vectolio Creator Dashboard to track your views, conversions, and top-selling items. By analyzing this data, you can double down on the styles that your audience loves the most.

> "The best time to start monetizing your skills was yesterday. The second best time is now."

Join the Vectolio community today and start building your passive income stream!
      `,
      coverImage: "/article-creator.jpg",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Maximize Earnings as a Digital Creator | Vectolio",
      seoDescription: "Discover strategies for selling digital assets, UI kits, and vector graphics on Vectolio to boost your income.",
      authorId: author.id,
      categoryId: categoryCreator.id,
      tags: { connect: [{ id: tagMonetization.id }, { id: tagTrends.id }] }
    }
  });

  console.log("Successfully seeded 3 articles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
