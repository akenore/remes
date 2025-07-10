# Deployment Checklist for Remes Project

## ✅ Completed Changes (Done Automatically)

### 1. **PocketBase Configuration Updates**
- Updated `web/lib/pocketbase.ts` to use environment variables
- Changed from hardcoded `http://127.0.0.1:8090` to `process.env.NEXT_PUBLIC_POCKETBASE_URL`

### 2. **Next.js Image Configuration**
- Added `https://remesapi.beandgo.us` to allowed image remote patterns in `web/next.config.ts`
- Allows Next.js to serve images from your deployed PocketBase

### 3. **Admin Interface Updates**
- Fixed hardcoded localhost URLs in admin pages (posts, categories)
- Updated preview URLs to use `NEXT_PUBLIC_FRONTEND_URL` environment variable
- Fixed test connection page to dynamically use configured PocketBase URL

### 4. **API Consistency Fixes**
- Fixed `pb.baseUrl` vs `pb.baseURL` inconsistencies in image URL generation
- Updated TinyMCE API key to use environment variable

### 5. **Environment Variables**
- Created `.env.local` with your production URLs

## 🚀 Deployment Steps

### 1. **Environment Variables for Plesk VPS Deployment**
In your Plesk control panel, set these environment variables for your Node.js application:

```bash
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=https://remesapi.beandgo.us

# Frontend URL (for admin interface previews)
NEXT_PUBLIC_FRONTEND_URL=https://remes.beandgo.us

# TinyMCE API Key (optional - free tier should work)
NEXT_PUBLIC_TINYMCE_API_KEY=pg6me9oxkjckfoljxo0v0oi3yypu9oy3okpbajeyh5l4gud9
```

**Plesk Steps:**
1. Go to your domain in Plesk → Node.js
2. Click "Environment Variables" 
3. Add each variable above with their values
4. Restart your Node.js application

### 2. **PocketBase CORS Configuration**
Make sure your PocketBase allows requests from your frontend domain:
1. Go to your PocketBase admin: `https://remesapi.beandgo.us/_/`
2. Navigate to Settings → Application
3. Add `https://remes.beandgo.us` to allowed origins

### 3. **Test Before Full Deployment**
- Test the connection: Visit `/test-connection` on your deployed site
- Verify admin login works
- Check that images load correctly
- Test creating/editing posts

## 🔍 Verification Checklist

### Frontend Deployment
- [ ] Environment variables are set correctly
- [ ] Site loads without console errors
- [ ] Admin panel is accessible
- [ ] Images from PocketBase load correctly
- [ ] Form submissions work

### PocketBase Integration
- [ ] API calls to PocketBase work
- [ ] Authentication works (admin login)
- [ ] File uploads work
- [ ] Image preview in admin works

## 🚨 Potential Issues & Solutions

### 1. **CORS Errors**
If you get CORS errors:
- Check PocketBase CORS settings
- Ensure your frontend domain is whitelisted

### 2. **Image Loading Issues**
If images don't load:
- Verify `next.config.ts` has the correct PocketBase domain
- Check that images exist in PocketBase storage

### 3. **Authentication Issues**
If login doesn't work:
- Verify PocketBase is accessible
- Check that admin user exists
- Test with test connection page

### 4. **Build Errors**
If build fails:
- Update Node.js version in Plesk (requires ^18.18.0 || ^19.8.0 || >= 20.0.0)
- Clear `.next` folder and reinstall dependencies
- Check Plesk Node.js logs for specific errors

### 5. **Plesk-Specific Issues**
- Ensure your domain points to the correct document root
- Check that Node.js is enabled for your domain
- Verify file permissions are correct (755 for directories, 644 for files)

## 📁 File Changes Summary

- `web/lib/pocketbase.ts` - Updated to use environment variables
- `web/next.config.ts` - Added PocketBase domain to image patterns
- `web/app/[locale]/(auth)/test-connection/page.tsx` - Dynamic PocketBase URL
- `web/app/[locale]/admin/posts/edit/[id]/page.tsx` - Environment variable URLs
- `web/app/[locale]/admin/posts/add/page.tsx` - Environment variable URLs
- `web/app/[locale]/admin/categories/page.tsx` - Environment variable URLs
- `web/components/layout/MagazineView.tsx` - Fixed baseURL consistency
- `web/app/[locale]/magazine/[slug]/page.tsx` - Fixed baseURL consistency
- `web/components/ui/admin/RichTextEditor.tsx` - Environment variable for API key
- `web/.env.local` - Production environment variables

## 🎉 Ready for Deployment!

Your project is now configured to work with:
- **PocketBase**: `https://remesapi.beandgo.us/`
- **Frontend**: `https://remes.beandgo.us/`

All hardcoded localhost URLs have been replaced with environment variables, and the configuration is production-ready! 