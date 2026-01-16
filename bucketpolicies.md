# Detailed Guide: Setting Up Storage Bucket Policies in Supabase

This guide provides step-by-step instructions for setting up storage bucket policies for the `product-images` bucket in Supabase.

## Prerequisites

- You have created the `product-images` bucket (see Step 3.1 in `supabase.md`)
- The bucket is set to **Public**

---

## Step 1: Navigate to Storage Policies

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. Click on the **`product-images`** bucket
3. Click on the **Policies** tab at the top
4. You should see a message saying "No policies created yet" or an empty policies list

---

## Step 2: Create Your First Policy (Public Read Access)

### 2.1 Start Creating a Policy

1. Click the **"New Policy"** button (usually in the top right)
2. You'll see a modal with two options:
   - **"Get started quickly"** - Create a policy from a template
   - **"For full customization"** - Create a policy from scratch
3. **Select "For full customization"** - This gives you full control over the policy

### 2.2 Configure the Policy

After selecting "For full customization", you'll see a form with the following fields:

**Policy Name:**
- Enter: `Public can view images`

**Allowed Operation:**
- Select: **SELECT** (this allows reading/viewing files)

**Target Roles:**
- Select: **public** (or leave it as "public" if it's the default)

**USING expression:**
- This is where you define WHEN the policy applies
- Enter the following SQL condition:
  ```sql
  bucket_id = 'product-images'
  ```

**WITH CHECK expression:**
- Leave this empty for SELECT operations (it's only needed for INSERT/UPDATE)

### 2.3 Review and Save

1. Review your policy settings:
   - Policy Name: `Public can view images`
   - Operation: SELECT
   - Target: public
   - USING: `bucket_id = 'product-images'`

2. Click **"Review"** or **"Save Policy"** (button name may vary)

3. Confirm the policy creation

---

## Step 3: Create Second Policy (Authenticated Upload)

### 3.1 Start Creating Another Policy

1. Click **"New Policy"** again
2. Select **"For full customization"**

### 3.2 Configure the Upload Policy

**Policy Name:**
- Enter: `Authenticated users can upload images`

**Allowed Operation:**
- Select: **INSERT** (this allows uploading files)

**Target Roles:**
- Select: **authenticated** (this restricts to logged-in users)

**USING expression:**
- Leave empty for INSERT operations (or use `true` if required)

**WITH CHECK expression:**
- This defines what conditions must be met for the INSERT to be allowed
- Enter:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

### 3.3 Save the Policy

1. Review your settings
2. Click **"Save Policy"**

---

## Step 4: Create Third Policy (Authenticated Update)

### 4.1 Create Update Policy

1. Click **"New Policy"**
2. Select **"For full customization"**

### 4.2 Configure the Update Policy

**Policy Name:**
- Enter: `Authenticated users can manage images`

**Allowed Operation:**
- Select: **UPDATE** (this allows modifying files)

**Target Roles:**
- Select: **authenticated**

**USING expression:**
- Enter:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

**WITH CHECK expression:**
- Enter:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

### 4.3 Save the Policy

---

## Step 5: Create Fourth Policy (Authenticated Delete)

### 5.1 Create Delete Policy

1. Click **"New Policy"**
2. Select **"For full customization"**

### 5.2 Configure the Delete Policy

**Policy Name:**
- Enter: `Authenticated users can delete images`

**Allowed Operation:**
- Select: **DELETE** (this allows deleting files)

**Target Roles:**
- Select: **authenticated**

**USING expression:**
- Enter:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

**WITH CHECK expression:**
- Leave empty for DELETE operations

### 5.3 Save the Policy

---

## Alternative: Using SQL Editor (Advanced)

If you prefer using SQL directly, you can also create these policies via the SQL Editor:

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Paste the following SQL:

```sql
-- Policy 1: Public can view images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Authenticated users can update images
CREATE POLICY "Authenticated users can manage images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

4. Click **"Run"** to execute

---

## Policy Summary

After completing all steps, you should have **4 policies** for the `product-images` bucket:

| Policy Name | Operation | Target | Purpose |
|------------|-----------|--------|---------|
| Public can view images | SELECT | public | Anyone can view/download images |
| Authenticated users can upload images | INSERT | authenticated | Only logged-in users can upload |
| Authenticated users can manage images | UPDATE | authenticated | Only logged-in users can update |
| Authenticated users can delete images | DELETE | authenticated | Only logged-in users can delete |

---

## Verifying Your Policies

1. Go to **Storage** → **Policies** → `product-images`
2. You should see all 4 policies listed
3. Each policy should show:
   - The policy name
   - The operation (SELECT, INSERT, UPDATE, DELETE)
   - The target role (public or authenticated)

---

## Testing Your Policies

### Test Public Read Access

1. Upload a test image to the bucket
2. Copy the public URL of the image
3. Open the URL in an incognito/private browser window (not logged in)
4. The image should load successfully ✅

### Test Authenticated Upload (Requires Auth Setup)

1. Log in to your Supabase project
2. Try uploading an image via the admin dashboard
3. The upload should succeed if you're authenticated ✅

---

## Common Issues and Solutions

### Issue: "Policy already exists"

**Solution:** If you see this error, the policy might already be created. Check the Policies tab to see if it's already there.

### Issue: "Permission denied" when viewing images

**Possible causes:**
1. The bucket is not set to **Public**
   - **Fix:** Go to Storage → `product-images` → Settings → Make sure "Public bucket" is enabled

2. The SELECT policy is missing or incorrect
   - **Fix:** Verify Policy 1 (Public can view images) exists and is correct

3. The image URL is incorrect
   - **Fix:** Make sure you're using the public URL format: `https://[project-id].supabase.co/storage/v1/object/public/product-images/[filename]`

### Issue: Can't upload images even when authenticated

**Possible causes:**
1. Not actually authenticated
   - **Fix:** Make sure you're logged in via Supabase Auth

2. INSERT policy is missing
   - **Fix:** Verify Policy 2 (Authenticated users can upload images) exists

3. WITH CHECK expression is incorrect
   - **Fix:** Make sure the WITH CHECK includes both `bucket_id = 'product-images'` AND `auth.role() = 'authenticated'`

---

## Understanding Policy Expressions

### USING vs WITH CHECK

- **USING**: Defines when a policy applies for SELECT, UPDATE, and DELETE operations
- **WITH CHECK**: Defines what conditions must be met for INSERT and UPDATE operations

### Common Expressions

- `bucket_id = 'product-images'` - Only applies to files in this specific bucket
- `auth.role() = 'authenticated'` - Only applies to logged-in users
- `true` - Applies to everyone (use with caution)

---

## Security Best Practices

1. **Always restrict write operations** (INSERT, UPDATE, DELETE) to authenticated users
2. **Use specific bucket names** in your policies to avoid conflicts
3. **Test policies** before deploying to production
4. **Review policies regularly** to ensure they match your security requirements
5. **Don't use `true` for write operations** unless you want public uploads (not recommended)

---

## Next Steps

After setting up your bucket policies:

1. ✅ Test that public users can view images
2. ✅ Set up authentication (if not already done)
3. ✅ Test that authenticated users can upload images
4. ✅ Update your admin dashboard to use Supabase Storage for image uploads
5. ✅ Upload your first product images

For more information, refer to:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

## Quick Reference: Policy Creation Checklist

- [ ] Navigate to Storage → Policies → `product-images`
- [ ] Create Policy 1: Public SELECT (view images)
- [ ] Create Policy 2: Authenticated INSERT (upload images)
- [ ] Create Policy 3: Authenticated UPDATE (modify images)
- [ ] Create Policy 4: Authenticated DELETE (delete images)
- [ ] Verify all 4 policies are listed
- [ ] Test public image viewing
- [ ] Test authenticated image upload (if auth is set up)

Good luck! 🚀
