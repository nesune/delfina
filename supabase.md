# Supabase Setup Guide for Delfina Home

This guide will walk you through setting up Supabase for your Delfina Home website. Follow these steps in order.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project (choose a region closest to your users)

---

## Step 1: Database Tables

### 1.1 Create the `products` table

Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_sq TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_sq TEXT NOT NULL,
  description_en TEXT NOT NULL,
  dimensions_sq TEXT DEFAULT '',
  dimensions_en TEXT DEFAULT '',
  materials_sq TEXT DEFAULT '',
  materials_en TEXT DEFAULT '',
  price TEXT DEFAULT 'On Request',
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_visible ON products(is_visible) WHERE is_visible = true;
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### 1.2 Create the `contact_submissions` table

Run this SQL:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_date ON contact_submissions(date DESC);
CREATE INDEX idx_contact_submissions_read ON contact_submissions(read);
```

---

## Step 2: Row Level Security (RLS)

### 2.1 Enable RLS on tables

```sql
-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

### 2.2 Create RLS Policies

**For `products` table** - Allow public read access to visible products:

```sql
-- Policy: Anyone can read visible products
CREATE POLICY "Public can view visible products"
ON products
FOR SELECT
USING (is_visible = true);

-- Policy: Authenticated users can manage all products (for admin)
CREATE POLICY "Admins can manage products"
ON products
FOR ALL
USING (auth.role() = 'authenticated');
```

**For `contact_submissions` table** - Allow public to insert, admins to read:

```sql
-- Policy: Anyone can insert contact submissions
CREATE POLICY "Public can insert contact submissions"
ON contact_submissions
FOR INSERT
WITH CHECK (true);

-- Policy: Authenticated users can read all submissions (for admin)
CREATE POLICY "Admins can read contact submissions"
ON contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can update submissions (mark as read)
CREATE POLICY "Admins can update contact submissions"
ON contact_submissions
FOR UPDATE
USING (auth.role() = 'authenticated');
```

---

## Step 3: Storage Bucket for Images

### 3.1 Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `product-images`
4. Make it **Public** (so images can be accessed without authentication)
5. Click **Create bucket**

### 3.2 Set Storage Policies

**Important:** When creating policies, select **"For full customization"** (create a policy from scratch) to have full control over the policy settings.

> 📖 **For detailed step-by-step instructions with UI screenshots, see [bucketpolicies.md](./bucketpolicies.md)**

Go to **Storage** → **Policies** → `product-images` and click **New Policy**. Select **"For full customization"** and add the following policies:

**Policy 1: Public read access**
```sql
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');
```

**Policy 2: Authenticated users can upload**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated users can update/delete**
```sql
CREATE POLICY "Authenticated users can manage images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

---

## Step 4: Authentication Setup (Optional but Recommended)

### 4.1 Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### 4.2 Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter admin email and password
4. Save the credentials securely

**Note:** Currently, the admin login uses a simple password check. For production, you should:
- Update `pages/admin/AdminLogin.tsx` to use Supabase Auth
- Use `supabase.auth.signInWithPassword()` instead of localStorage check

---

## Step 5: Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

---

## Step 6: Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example` if it exists)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Add optional configuration:

```env
# Contact Information
VITE_CONTACT_ADDRESS=Rruga Tirana, Prishtinë
VITE_CONTACT_PHONE=+383 44 123 456
VITE_CONTACT_EMAIL=info@delfinahome.com
VITE_WHATSAPP_NUMBER=38344123456

# Social Media Links
VITE_INSTAGRAM_URL=https://instagram.com/yourhandle
VITE_PINTEREST_URL=https://pinterest.com/yourhandle
VITE_LINKEDIN_URL=https://linkedin.com/company/yourcompany

# Image URLs (use Supabase Storage URLs after uploading)
VITE_HERO_IMAGE=https://your-project-id.supabase.co/storage/v1/object/public/product-images/hero.jpg
VITE_ABOUT_HEADER_IMAGE=https://your-project-id.supabase.co/storage/v1/object/public/product-images/about-header.jpg
```

---

## Step 7: Upload Images to Storage

### 7.1 Upload via Dashboard

1. Go to **Storage** → **product-images**
2. Click **Upload file**
3. Upload your images
4. Copy the public URL for each image

### 7.2 Upload via Code (Future Enhancement)

You can enhance the admin dashboard to upload images directly. The code structure is already in place in `pages/admin/AdminDashboard.tsx` - you just need to integrate Supabase Storage upload.

Example code for future implementation:

```typescript
const uploadImage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
```

---

## Step 8: Test Your Setup

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Test the following:
   - View products on the collection page
   - Submit a contact form
   - Access admin dashboard (currently uses simple password: `delfina2024`)
   - Add/edit/delete products in admin

---

## Step 9: Production Considerations

### 9.1 Update Admin Authentication

The current admin login is basic. For production, update `pages/admin/AdminLogin.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });
  
  if (data.user) {
    onLogin();
  } else {
    setError(true);
  }
};
```

### 9.2 Add Rate Limiting

Consider adding rate limiting for:
- Contact form submissions
- Product API calls

### 9.3 Image Optimization

- Use Supabase Storage with image transformations
- Or use a CDN like Cloudflare Images
- Compress images before uploading

### 9.4 Backup Strategy

- Set up automated backups in Supabase
- Export data regularly

---

## Troubleshooting

### Products not showing?

1. Check RLS policies are correct
2. Verify `is_visible` is `true` in database
3. Check browser console for errors
4. Verify environment variables are set

### Can't insert products in admin?

1. Check you're authenticated (if using Supabase Auth)
2. Verify RLS policies allow authenticated users
3. Check browser console for specific error messages

### Images not loading?

1. Verify storage bucket is public
2. Check storage policies allow public read
3. Verify image URLs are correct
4. Check CORS settings if needed

### Contact form not working?

1. Check RLS policy allows public INSERT
2. Verify email is valid format
3. Check Supabase logs for errors

---

## Support

If you encounter issues:
1. Check Supabase logs: **Logs** → **Postgres Logs** or **API Logs**
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure RLS policies match your use case

---

## Next Steps

After setup:
1. Add your first products via the admin dashboard
2. Upload product images to Supabase Storage
3. Update contact information in `.env`
4. Configure social media links
5. Test all functionality thoroughly
6. Deploy to production

Good luck! 🚀
