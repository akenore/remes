# Remes Web

Remes Web is a premium medical residence platform based in Tunisia, offering high-end EHPAD (Nursing Home) services and tailored medical vacation stays. The platform combines luxury comfort, personalized medical care, and a serene Mediterranean environment.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Backend/DB**: [PocketBase](https://pocketbase.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) (FR/EN)
- **CMS Features**: [TinyMCE React](https://github.com/tinymce/tinymce-react) for rich text editing
- **UI Components**: Embla Carousel, React Icons
- **Language**: TypeScript

## ✨ Key Features

- **Multilingual Support**: Fully localized in French and English with SEO-friendly routing.
- **Admin Dashboard**: Comprehensive management of:
  - Magazine articles and categories.
  - Home page slider content.
  - Medical equipment catalog.
  - Customer testimonials.
- **Medical Equipment Catalog**: Responsive display of available medical equipment with daily/monthly pricing.
- **SEO Optimized**: Custom `sitemap.ts`, metadata handling, and optimized fonts/images.
- **Secure**: Implemented Content Security Policy (CSP) and secure authentication via PocketBase.

## 📁 Project Structure

- `app/`: Next.js App Router folders, includes `[locale]` for i18n routing.
- `components/`: Modular UI components separated by features (admin, layout, UI).
- `messages/`: Localization JSON files used by `next-intl`.
- `lib/`: Core logic, including PocketBase client, Auth context, and SEO utilities.
- `public/`: Static assets and icons.
- `proxy.ts`: Middleware for CSP and localization handling.

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 22.17.0
- pnpm (recommended)

### Installation

1. Clone the repository and navigate to the web directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Configuration

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-instance.com
```

### Development

Run the development server with Turbopack:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Production

```bash
pnpm build
pnpm start
```

## 🔒 Security

The project uses a custom middleware (`proxy.ts`) to inject a strict Content Security Policy (CSP) with nonces for script-src and style-src, ensuring protection against XSS and other injection attacks.

## 📄 License

Private - All rights reserved to Remes.
