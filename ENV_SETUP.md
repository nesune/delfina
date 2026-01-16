# How to Set Up Environment Variables

Environment variables allow you to configure your website without modifying code. Here's how to add your Instagram URL and other settings.

## Step 1: Create a `.env` File

1. In your project root folder (same folder as `package.json`), create a new file named `.env`
   - **Important:** The file must be named exactly `.env` (with the dot at the beginning)
   - Make sure there are no spaces in the filename

2. **On Windows:** If Windows Explorer doesn't let you create a file starting with a dot:
   - Open your code editor (VS Code, etc.)
   - Go to File → New File
   - Save it as `.env` (make sure to include the dot)

## Step 2: Add Your Environment Variables

Copy the example below into your `.env` file and replace with your actual values:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Contact Information (Optional)
VITE_CONTACT_ADDRESS=Rruga Tirana, Prishtinë
VITE_CONTACT_PHONE=+383 44 123 456
VITE_CONTACT_EMAIL=info@delfinahome.com
VITE_WHATSAPP_NUMBER=38344123456

# Social Media Links (Optional)
VITE_INSTAGRAM_URL=https://www.instagram.com/yourusername/
VITE_PINTEREST_URL=https://www.pinterest.com/yourusername/
VITE_LINKEDIN_URL=https://www.linkedin.com/company/yourcompany/
```

## Step 3: Add Your Instagram URL

To add your Instagram URL, simply add this line to your `.env` file:

```env
VITE_INSTAGRAM_URL=https://www.instagram.com/yourusername/
```

**Examples:**
- If your Instagram is `@delfinahome`, use: `VITE_INSTAGRAM_URL=https://www.instagram.com/delfinahome/`
- If your Instagram is `@delfina_home`, use: `VITE_INSTAGRAM_URL=https://www.instagram.com/delfina_home/`

## Important Rules

1. **No spaces** around the `=` sign
   - ✅ Correct: `VITE_INSTAGRAM_URL=https://instagram.com/user`
   - ❌ Wrong: `VITE_INSTAGRAM_URL = https://instagram.com/user`

2. **No quotes needed** (unless the value has spaces)
   - ✅ Correct: `VITE_INSTAGRAM_URL=https://instagram.com/user`
   - ❌ Wrong: `VITE_INSTAGRAM_URL="https://instagram.com/user"`

3. **Always use full URLs** starting with `https://`
   - ✅ Correct: `VITE_INSTAGRAM_URL=https://www.instagram.com/delfinahome/`
   - ❌ Wrong: `VITE_INSTAGRAM_URL=@delfinahome`
   - ❌ Wrong: `VITE_INSTAGRAM_URL=instagram.com/delfinahome`

4. **Restart your dev server** after changing `.env` file
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Where These Variables Are Used

### Social Media Links
- **Location:** Footer of every page
- **Variables:** `VITE_INSTAGRAM_URL`, `VITE_PINTEREST_URL`, `VITE_LINKEDIN_URL`
- **Behavior:** Only shows links if you set them in `.env`

### Contact Information
- **Location:** Contact page and footer
- **Variables:** `VITE_CONTACT_ADDRESS`, `VITE_CONTACT_PHONE`, `VITE_CONTACT_EMAIL`, `VITE_WHATSAPP_NUMBER`

### Images
- **Location:** Home page (hero section, about section)
- **Variables:** `VITE_HERO_IMAGE`, `VITE_ABOUT_MAIN_IMAGE`, etc.
- **Note:** If not set, the site will use local images from `assets/images/` folder

## Complete Example `.env` File

Here's a complete example with all variables:

```env
# Supabase (REQUIRED for database and storage)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Contact Info
VITE_CONTACT_ADDRESS=Rruga Delfina, 119, Malishevë 24000, Kosovë
VITE_CONTACT_PHONE=+383 49 664 999
VITE_CONTACT_EMAIL=info@delfinahome.com
VITE_WHATSAPP_NUMBER=38349664999

# Social Media
VITE_INSTAGRAM_URL=https://www.instagram.com/delfina_home/
VITE_PINTEREST_URL=https://www.pinterest.com/delfinahome/
VITE_LINKEDIN_URL=https://www.linkedin.com/company/delfina-home/
```

## After Creating `.env`

1. **Save the file**
2. **Restart your development server:**
   ```bash
   # Stop the server (press Ctrl+C)
   # Then start it again
   npm run dev
   ```
3. **Check the footer** - Your Instagram link should now appear!

## Security Note

- ⚠️ **Never commit `.env` to Git** - It contains sensitive information
- The `.env` file should already be in `.gitignore`
- Only commit `.env.example` (which doesn't contain real values)

## Troubleshooting

### My Instagram link doesn't show up
1. Make sure you saved the `.env` file
2. Restart your dev server (`npm run dev`)
3. Check that the URL is correct (starts with `https://`)
4. Check browser console for any errors

### I see "Social links coming soon" in the footer
- This means none of the social media environment variables are set
- Add at least one (like `VITE_INSTAGRAM_URL`) to see a link appear

### The `.env` file doesn't work
- Make sure the filename is exactly `.env` (with the dot)
- Make sure it's in the root folder (same level as `package.json`)
- Restart your dev server after creating/editing it
