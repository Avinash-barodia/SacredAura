const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Simple .env parser to avoid extra dependencies
const envFile = path.resolve(__dirname, '../.env');
if (fs.existsSync(envFile)) {
  const envConfig = fs.readFileSync(envFile, 'utf-8').split('\n');
  envConfig.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^"|"$/g, '');
    }
  });
}

const generateSitemap = async () => {
  console.log("Generating sitemap...");

  try {
    const smStream = new SitemapStream({ hostname: 'https://[yourdomain.com]' });
    const writePath = path.resolve(__dirname, '../public/sitemap.xml');
    const writeStream = createWriteStream(writePath);

    smStream.pipe(writeStream);

    // Static Routes
    smStream.write({ url: '/', changefreq: 'weekly', priority: 1.0 });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/refund-policy', changefreq: 'monthly', priority: 0.3 });
    smStream.write({ url: '/terms-conditions', changefreq: 'monthly', priority: 0.3 });

    // Dynamic Routes (Products)
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000/api';
    console.log(`Fetching products from ${apiUrl}/products...`);

    let page = 1;
    let totalPages = 1;

    do {
      try {
        const res = await axios.get(`${apiUrl}/products?page=${page}&limit=50`);
        const data = res.data;
        
        let products = [];
        if (Array.isArray(data)) {
          products = data;
          totalPages = 1;
        } else {
          products = data.products || [];
          totalPages = data.totalPages || 1;
        }

        products.forEach(product => {
          if (product._id) {
            smStream.write({ url: `/product/${product._id}`, changefreq: 'weekly', priority: 0.7 });
          }
        });

        page++;
      } catch (err) {
        console.warn(`Warning: Failed to fetch products on page ${page}: ${err.message}`);
        console.warn("Falling back to static routes only.");
        break; // Stop fetching more pages if one fails
      }
    } while (page <= totalPages);

    smStream.end();

    await streamToPromise(smStream);
    console.log(`Sitemap written successfully to ${writePath}`);
  } catch (err) {
    console.warn("Warning: Failed to generate sitemap completely.", err.message);
  }
};

generateSitemap();
