# Ticket 001: Project Initialization & Base App Shell

**Phase:** Phase 0 — Project Setup & Architecture
**Dependencies:** None
**Estimated complexity:** M

## Goal

Initialize the Vixi monorepo with Turborepo, set up the Next.js app shell with Tailwind CSS and shadcn/ui, configure Prisma with PostgreSQL, set up Auth.js, create the base folder structure, and build a placeholder dashboard with sidebar navigation. The app should compile, run, and display a branded "Vixi" dashboard with empty states.

## Files/Areas Likely to Change

- Root: `package.json`, `turbo.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `.gitignore`, `.env.example`, `docker-compose.yml`
- Apps/web: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/tailwind.config.ts`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/app/globals.css`
- Packages/ui: `packages/ui/` (shadcn components setup)
- Packages/db: `packages/db/` (Prisma schema, client)
- Packages/auth: `packages/auth/` (Auth.js config)
- Config files: `.eslintrc.js`, `.prettierrc`, `commitlint.config.js`

## Detailed Implementation Steps

### Step 1: Initialize monorepo structure

1. Create root `package.json`:
   ```json
   {
     "name": "vixi",
     "private": true,
     "scripts": {
       "dev": "turbo dev",
       "build": "turbo build",
       "lint": "turbo lint",
       "clean": "turbo clean",
       "format": "prettier --write \"**/*.{ts,tsx,md}\""
     },
     "devDependencies": {
       "turbo": "^2.0.0",
       "prettier": "^3.2.0",
       "eslint": "^9.0.0",
       "typescript": "^5.5.0"
     },
     "packageManager": "pnpm@11.5.2"
   }
   ```

2. Create `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

3. Create `turbo.json`:
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "globalDependencies": ["**/.env.*local"],
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".next/**", "!.next/cache/**", "dist/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "lint": {},
       "clean": {
         "cache": false
       }
     }
   }
   ```

4. Create root `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true
     }
   }
   ```

5. Create `.gitignore`:
   ```
   node_modules/
   .next/
   .env
   .env.local
   .env.*.local
   dist/
   build/
   .turbo/
   *.tsbuildinfo
   uploads/
   .pnpm-store/
   ```

6. Create `.env.example`:
   ```
   # Database
   DATABASE_URL="postgresql://vixi:vixi@localhost:5432/vixi"

   # Auth
   AUTH_SECRET="generate-with-openssl-rand-base64-32"
   AUTH_URL="http://localhost:3000"

   # Next.js
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

### Step 2: Set up Docker Compose for PostgreSQL

Create `docker-compose.yml`:
```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    container_name: vixi-postgres
    environment:
      POSTGRES_DB: vixi
      POSTGRES_USER: vixi
      POSTGRES_PASSWORD: vixi
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Step 3: Create the database package (`packages/db`)

1. Create `packages/db/package.json`:
   ```json
   {
     "name": "@vixi/db",
     "version": "0.1.0",
     "private": true,
     "scripts": {
       "db:generate": "prisma generate",
       "db:push": "prisma db push",
       "db:migrate": "prisma migrate dev",
       "db:studio": "prisma studio",
       "db:seed": "tsx src/seed.ts"
     },
     "dependencies": {
       "@prisma/client": "^5.20.0"
     },
     "devDependencies": {
       "prisma": "^5.20.0",
       "tsx": "^4.0.0",
       "typescript": "^5.5.0"
     }
   }
   ```

2. Create `packages/db/prisma/schema.prisma`:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   // ===== AUTH (NextAuth.js v5) =====

   model User {
     id                String   @id @default(uuid()) @db.Uuid
     email             String   @unique
     name              String?
     password          String?  // hashed password for credential auth
     avatarUrl         String?  @map("avatar_url")
     dateOfBirth       DateTime? @map("date_of_birth")
     phone             String?
     timezone          String   @default("UTC")
     onboardingCompleted Boolean @default(false) @map("onboarding_completed")
     onboardingStep    Int      @default(0) @map("onboarding_step")
     emailVerified     DateTime? @map("email_verified")
     createdAt         DateTime @default(now()) @map("created_at")
     updatedAt         DateTime @updatedAt @map("updated_at")
     deletedAt         DateTime? @map("deleted_at")

     accounts         Account[]
     sessions         Session[]
     vaultItems       VaultItem[]
     vaultItemFiles   VaultItemFile[]
     trustedContacts  TrustedContact[]
     funeralPlan      FuneralPlan?
     guardianshipNote GuardianshipNote?
     digitalAssetInstruction DigitalAssetInstruction?
     finalMessages    FinalMessage[]
     memories         Memory[]
     memoryFiles      MemoryFile[]
     auditLogs        AuditLog[]

     @@map("users")
   }

   model Account {
     id                String  @id @default(uuid()) @db.Uuid
     userId            String  @map("user_id") @db.Uuid
     type              String
     provider          String
     providerAccountId String  @map("provider_account_id")
     refreshToken      String? @map("refresh_token")
     accessToken       String? @map("access_token")
     expiresAt         Int?    @map("expires_at")
     tokenType         String? @map("token_type")
     scope             String?
     idToken           String? @map("id_token")
     sessionState      String? @map("session_state")

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@unique([provider, providerAccountId])
     @@map("accounts")
   }

   model Session {
     id           String   @id @default(uuid()) @db.Uuid
     sessionToken String   @unique @map("session_token")
     userId       String   @map("user_id") @db.Uuid
     expires      DateTime

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@map("sessions")
   }

   model VerificationToken {
     identifier String
     token      String   @unique
     expires    DateTime

     @@unique([identifier, token])
     @@map("verification_tokens")
   }

   // ===== VAULT =====

   model VaultCategory {
     id          String   @id @default(uuid()) @db.Uuid
     name        String
     slug        String   @unique
     icon        String
     description String?
     isPredefined Boolean @default(true) @map("is_predefined")
     sortOrder   Int      @default(0) @map("sort_order")
     createdAt   DateTime @default(now()) @map("created_at")

     items VaultItem[]

     @@map("vault_categories")
   }

   model VaultItem {
     id          String    @id @default(uuid()) @db.Uuid
     userId      String    @map("user_id") @db.Uuid
     categoryId  String    @map("category_id") @db.Uuid
     title       String
     description String?
     value       String?
     isSensitive Boolean   @default(false) @map("is_sensitive")
     tags        String[]
     customFields Json?    @map("custom_fields") @db.JsonB
     expiresAt   DateTime? @map("expires_at")
     sortOrder   Int       @default(0) @map("sort_order")
     createdAt   DateTime  @default(now()) @map("created_at")
     updatedAt   DateTime  @updatedAt @map("updated_at")
     deletedAt   DateTime? @map("deleted_at")

     user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
     category VaultCategory   @relation(fields: [categoryId], references: [id])
     files    VaultItemFile[]

     @@map("vault_items")
   }

   model VaultItemFile {
     id          String   @id @default(uuid()) @db.Uuid
     vaultItemId String   @map("vault_item_id") @db.Uuid
     fileKey     String   @map("file_key")
     fileName    String   @map("file_name")
     fileSize    Int      @map("file_size")
     mimeType    String   @map("mime_type")
     isEncrypted Boolean  @default(false) @map("is_encrypted")
     createdAt   DateTime @default(now()) @map("created_at")

     vaultItem VaultItem @relation(fields: [vaultItemId], references: [id], onDelete: Cascade)

     @@map("vault_item_files")
   }

   // ===== TRUSTED CIRCLE =====

   model TrustedContact {
     id           String    @id @default(uuid()) @db.Uuid
     userId       String    @map("user_id") @db.Uuid
     name         String
     email        String
     phone        String?
     relationship String?
     roles        String[]
     inviteStatus String    @default("pending") @map("invite_status")
     inviteToken  String?   @map("invite_token")
     invitedAt    DateTime? @map("invited_at")
     acceptedAt   DateTime? @map("accepted_at")
     notes        String?
     sortOrder    Int       @default(0) @map("sort_order")
     createdAt    DateTime  @default(now()) @map("created_at")
     updatedAt    DateTime  @updatedAt @map("updated_at")
     deletedAt    DateTime? @map("deleted_at")

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@map("trusted_contacts")
   }

   // ===== WILL & WISHES =====

   model FuneralPlan {
     id                     String   @id @default(uuid()) @db.Uuid
     userId                 String   @unique @map("user_id") @db.Uuid
     burialOrCremation      String?  @map("burial_or_cremation")
     burialLocation         String?  @map("burial_location")
     cremationInstructions  String?  @map("cremation_instructions")
     serviceLocation        String?  @map("service_location")
     serviceDatePreference  String?  @map("service_date_preference")
     music                  String[]
     readings               String[]
     dressCode              String?  @map("dress_code")
     flowerPreferences      String?  @map("flower_preferences")
     charityPreferences     String?  @map("charity_preferences")
     obituaryDraft          String?  @map("obituary_draft")
     additionalNotes        String?  @map("additional_notes")
     isComplete             Boolean  @default(false) @map("is_complete")
     completionPercentage   Int      @default(0) @map("completion_percentage")
     createdAt              DateTime @default(now()) @map("created_at")
     updatedAt              DateTime @updatedAt @map("updated_at")

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@map("funeral_plans")
   }

   model GuardianshipNote {
     id                   String   @id @default(uuid()) @db.Uuid
     userId               String   @unique @map("user_id") @db.Uuid
     minorChildrenNotes   String?  @map("minor_children_notes")
     petCareInstructions  String?  @map("pet_care_instructions")
     petDetails           Json?    @map("pet_details") @db.JsonB
     additionalNotes      String?  @map("additional_notes")
     createdAt            DateTime @default(now()) @map("created_at")
     updatedAt            DateTime @updatedAt @map("updated_at")

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@map("guardianship_notes")
   }

   model DigitalAssetInstruction {
     id                        String   @id @default(uuid()) @db.Uuid
     userId                    String   @unique @map("user_id") @db.Uuid
     socialMediaInstructions   String?  @map("social_media_instructions")
     cryptoInstructions        String?  @map("crypto_instructions")
     onlineAccountsInstructions String? @map("online_accounts_instructions")
     domainInstructions        String?  @map("domain_instructions")
     additionalNotes           String?  @map("additional_notes")
     createdAt                 DateTime @default(now()) @map("created_at")
     updatedAt                 DateTime @updatedAt @map("updated_at")

     user User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@map("digital_asset_instructions")
   }

   model FinalMessage {
     id          String    @id @default(uuid()) @db.Uuid
     userId      String    @map("user_id") @db.Uuid
     title       String
     content     String
     recipientId String?   @map("recipient_id") @db.Uuid
     isGeneral   Boolean   @default(true) @map("is_general")
     isApproved  Boolean   @default(true) @map("is_approved")
     createdAt   DateTime  @default(now()) @map("created_at")
     updatedAt   DateTime  @updatedAt @map("updated_at")
     deletedAt   DateTime? @map("deleted_at")

     user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
     recipient TrustedContact?  @relation(fields: [recipientId], references: [id])

     @@map("final_messages")
   }

   // ===== MEMORY ARCHIVE =====

   model Memory {
     id         String    @id @default(uuid()) @db.Uuid
     userId     String    @map("user_id") @db.Uuid
     title      String
     story      String
     date       DateTime?
     tags       String[]
     isFavorite Boolean   @default(false) @map("is_favorite")
     mood       String?
     createdAt  DateTime  @default(now()) @map("created_at")
     updatedAt  DateTime  @updatedAt @map("updated_at")
     deletedAt  DateTime? @map("deleted_at")

     user  User         @relation(fields: [userId], references: [id], onDelete: Cascade)
     files MemoryFile[]

     @@map("memories")
   }

   model MemoryFile {
     id        String   @id @default(uuid()) @db.Uuid
     memoryId  String   @map("memory_id") @db.Uuid
     fileKey   String   @map("file_key")
     fileName  String   @map("file_name")
     fileSize  Int      @map("file_size")
     mimeType  String   @map("mime_type")
     fileType  String   @map("file_type")
     createdAt DateTime @default(now()) @map("created_at")

     memory Memory @relation(fields: [memoryId], references: [id], onDelete: Cascade)

     @@map("memory_files")
   }

   // ===== AUDIT =====

   model AuditLog {
     id         String   @id @default(uuid()) @db.Uuid
     userId     String   @map("user_id") @db.Uuid
     action     String
     entityType String   @map("entity_type")
     entityId   String   @map("entity_id") @db.Uuid
     metadata   Json?    @db.JsonB
     ipAddress  String?  @map("ip_address")
     userAgent  String?  @map("user_agent")
     createdAt  DateTime @default(now()) @map("created_at")

     user User @relation(fields: [userId], references: [id])

     @@map("audit_logs")
   }
   ```

3. Create `packages/db/src/client.ts`:
   ```typescript
   import { PrismaClient } from "@prisma/client";

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined;
   };

   export const prisma = globalForPrisma.prisma ?? new PrismaClient();

   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```

4. Create `packages/db/src/seed.ts` with predefined vault categories:
   ```typescript
   import { prisma } from "./client";

   const categories = [
     { name: "Accounts & Passwords", slug: "accounts", icon: "key", sortOrder: 1 },
     { name: "Insurance Policies", slug: "policies", icon: "shield", sortOrder: 2 },
     { name: "Assets & Property", slug: "assets", icon: "home", sortOrder: 3 },
     { name: "Debts & Liabilities", slug: "debts", icon: "credit-card", sortOrder: 4 },
     { name: "Pets", slug: "pets", icon: "paw-print", sortOrder: 5 },
     { name: "Subscriptions", slug: "subscriptions", icon: "repeat", sortOrder: 6 },
     { name: "Medical Preferences", slug: "medical", icon: "heart-pulse", sortOrder: 7 },
     { name: "Emergency Instructions", slug: "emergency", icon: "alert-triangle", sortOrder: 8 },
     { name: "Digital Assets", slug: "digital", icon: "monitor", sortOrder: 9 },
     { name: "Other", slug: "other", icon: "folder", sortOrder: 10 },
   ];

   async function main() {
     console.log("Seeding vault categories...");
     for (const cat of categories) {
       await prisma.vaultCategory.upsert({
         where: { slug: cat.slug },
         update: {},
         create: cat,
       });
     }
     console.log("Done.");
   }

   main()
     .catch((e) => {
       console.error(e);
       process.exit(1);
     })
     .finally(() => prisma.$disconnect());
   ```

5. Create `packages/db/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src"]
   }
   ```

### Step 4: Create the auth package (`packages/auth`)

1. Create `packages/auth/package.json`:
   ```json
   {
     "name": "@vixi/auth",
     "version": "0.1.0",
     "private": true,
     "dependencies": {
       "@vixi/db": "workspace:*",
       "next": "^15.0.0",
       "next-auth": "5.0.0-beta.25",
       "bcryptjs": "^2.4.3",
       "nodemailer": "^6.9.0"
     },
     "devDependencies": {
       "@types/bcryptjs": "^2.4.0",
       "@types/nodemailer": "^6.4.0",
       "typescript": "^5.5.0"
     }
   }
   ```

2. Create `packages/auth/src/index.ts`:
   ```typescript
   import NextAuth from "next-auth";
   import { authConfig } from "./config";

   export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
   ```

3. Create `packages/auth/src/config.ts`:
   ```typescript
   import type { NextAuthConfig } from "next-auth";
   import Credentials from "next-auth/providers/credentials";
   import Google from "next-auth/providers/google";
   import { compare } from "bcryptjs";
   import { prisma } from "@vixi/db";

   export const authConfig: NextAuthConfig = {
     pages: {
       signIn: "/login",
       newUser: "/onboarding",
     },
     callbacks: {
       async jwt({ token, user }) {
         if (user) {
           token.id = user.id;
         }
         return token;
       },
       async session({ session, token }) {
         if (token.id) {
           session.user.id = token.id as string;
         }
         return session;
       },
       authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         const protectedPaths = ["/dashboard", "/vault", "/circle", "/wishes", "/memories", "/settings"];
         const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));

         if (isProtected && !isLoggedIn) {
           return false;
         }
         return true;
       },
     },
     providers: [
       Credentials({
         credentials: {
           email: { label: "Email", type: "email" },
           password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
           if (!credentials?.email || !credentials?.password) return null;

           const user = await prisma.user.findUnique({
             where: { email: credentials.email as string },
           });

           if (!user || !user.password) return null;

           const isValid = await compare(credentials.password as string, user.password);
           if (!isValid) return null;

           return {
             id: user.id,
             email: user.email,
             name: user.name,
             image: user.avatarUrl,
           };
         },
       }),
       Google,
     ],
   };
   ```

4. Create `packages/auth/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src"]
   }
   ```

### Step 5: Create the UI package (`packages/ui`)

1. Create `packages/ui/package.json`:
   ```json
   {
     "name": "@vixi/ui",
     "version": "0.1.0",
     "private": true,
     "dependencies": {
       "next": "^15.0.0",
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "lucide-react": "^0.450.0",
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.1.0",
       "tailwind-merge": "^2.5.0",
       "tailwindcss-animate": "^1.0.0"
     },
     "devDependencies": {
       "typescript": "^5.5.0",
       "tailwindcss": "^4.0.0"
     }
   }
   ```

2. Create `packages/ui/src/lib/utils.ts`:
   ```typescript
   import { type ClassValue, clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

3. Create `packages/ui/src/components/button.tsx`:
   ```typescript
   import * as React from "react";
   import { cva, type VariantProps } from "class-variance-authority";
   import { cn } from "../lib/utils";

   const buttonVariants = cva(
     "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground hover:bg-primary/90",
           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
           outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
           secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
           ghost: "hover:bg-accent hover:text-accent-foreground",
           link: "text-primary underline-offset-4 hover:underline",
         },
         size: {
           default: "h-10 px-4 py-2",
           sm: "h-9 rounded-md px-3",
           lg: "h-11 rounded-md px-8",
           icon: "h-10 w-10",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     }
   );

   export interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {}

   const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, ...props }, ref) => {
       return (
         <button
           className={cn(buttonVariants({ variant, size, className }))}
           ref={ref}
           {...props}
         />
       );
     }
   );
   Button.displayName = "Button";

   export { Button, buttonVariants };
   ```

4. Create `packages/ui/src/index.ts`:
   ```typescript
   export { Button, buttonVariants } from "./components/button";
   export type { ButtonProps } from "./components/button";
   export { cn } from "./lib/utils";
   ```

5. Create `packages/ui/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src",
       "jsx": "react-jsx"
     },
     "include": ["src"]
   }
   ```

### Step 6: Create the Next.js app (`apps/web`)

1. Create `apps/web/package.json`:
   ```json
   {
     "name": "@vixi/web",
     "version": "0.1.0",
     "private": true,
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     },
     "dependencies": {
       "@vixi/auth": "workspace:*",
       "@vixi/db": "workspace:*",
       "@vixi/ui": "workspace:*",
       "next": "^15.0.0",
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "lucide-react": "^0.450.0",
       "@tanstack/react-query": "^5.60.0",
       "react-hook-form": "^7.53.0",
       "zod": "^3.23.0",
       "@hookform/resolvers": "^3.9.0",
       "date-fns": "^4.1.0"
     },
     "devDependencies": {
       "typescript": "^5.5.0",
       "tailwindcss": "^4.0.0",
       "postcss": "^8.4.0",
       "autoprefixer": "^10.4.0",
       "@types/node": "^22.0.0",
       "@types/react": "^19.0.0",
       "@types/react-dom": "^19.0.0"
     }
   }
   ```

2. Create `apps/web/next.config.ts`:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     transpilePackages: ["@vixi/ui", "@vixi/auth", "@vixi/db"],
   };

   export default nextConfig;
   ```

3. Create `apps/web/tailwind.config.ts`:
   ```typescript
   import type { Config } from "tailwindcss";

   const config: Config = {
     darkMode: ["class"],
     content: [
       "./src/**/*.{ts,tsx}",
       "../../packages/ui/src/**/*.{ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: "#0D7377",
             foreground: "#FFFFFF",
           },
           secondary: {
             DEFAULT: "#D4A373",
             foreground: "#1A1A1A",
           },
           accent: {
             DEFAULT: "#E07A5F",
             foreground: "#FFFFFF",
           },
           background: "#FDFBF7",
           foreground: "#2D2D2D",
           muted: {
             DEFAULT: "#F0EDE8",
             foreground: "#6B6B6B",
           },
           card: {
             DEFAULT: "#FFFFFF",
             foreground: "#2D2D2D",
           },
           border: "#E5E2DC",
           input: "#E5E2DC",
           ring: "#0D7377",
           destructive: {
             DEFAULT: "#C75B5B",
             foreground: "#FFFFFF",
           },
           success: {
             DEFAULT: "#7EB87E",
             foreground: "#FFFFFF",
           },
         },
         borderRadius: {
           lg: "0.75rem",
           md: "0.5rem",
           sm: "0.25rem",
         },
         fontFamily: {
           sans: ["Inter", "system-ui", "sans-serif"],
           serif: ["Merriweather", "Georgia", "serif"],
         },
       },
     },
     plugins: [require("tailwindcss-animate")],
   };

   export default config;
   ```

4. Create `apps/web/postcss.config.js`:
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

5. Create `apps/web/src/app/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap');

   @layer base {
     * {
       @apply border-border;
     }
     body {
       @apply bg-background text-foreground font-sans;
     }
   }
   ```

6. Create `apps/web/src/app/layout.tsx`:
   ```typescript
   import type { Metadata } from "next";
   import { SessionProvider } from "next-auth/react";
   import "./globals.css";

   export const metadata: Metadata = {
     title: "Vixi — Your Life, Your Legacy, Your Peace of Mind",
     description:
       "Organize your life information, preserve memories, plan your wishes, and give your loved ones peace of mind.",
   };

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body>
           <SessionProvider>{children}</SessionProvider>
         </body>
       </html>
     );
   }
   ```

7. Create `apps/web/src/app/page.tsx`:
   ```typescript
   import { redirect } from "next/navigation";
   import { auth } from "@vixi/auth";

   export default async function Home() {
     const session = await auth();
     if (session?.user) {
       redirect("/dashboard");
     }
     redirect("/login");
   }
   ```

8. Create `apps/web/src/app/(auth)/login/page.tsx`:
   ```typescript
   import { LoginForm } from "./login-form";

   export default function LoginPage() {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="w-full max-w-md p-8">
           <div className="text-center mb-8">
             <h1 className="text-3xl font-serif font-bold text-primary">Vixi</h1>
             <p className="text-muted-foreground mt-2">
               Your life, your legacy, your peace of mind.
             </p>
           </div>
           <LoginForm />
         </div>
       </div>
     );
   }
   ```

9. Create `apps/web/src/app/(auth)/login/login-form.tsx`:
   ```typescript
   "use client";

   import { useState } from "react";
   import { signIn } from "next-auth/react";
   import { useRouter } from "next/navigation";
   import { Button } from "@vixi/ui";

   export function LoginForm() {
     const router = useRouter();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [error, setError] = useState("");
     const [loading, setLoading] = useState(false);

     async function handleSubmit(e: React.FormEvent) {
       e.preventDefault();
       setLoading(true);
       setError("");

       const result = await signIn("credentials", {
         email,
         password,
         redirect: false,
       });

       if (result?.error) {
         setError("Invalid email or password");
         setLoading(false);
         return;
       }

       router.push("/dashboard");
       router.refresh();
     }

     return (
       <form onSubmit={handleSubmit} className="space-y-4">
         {error && (
           <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
             {error}
           </div>
         )}
         <div>
           <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
             Email
           </label>
           <input
             id="email"
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
           />
         </div>
         <div>
           <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
             Password
           </label>
           <input
             id="password"
             type="password"
             value={password}
             onChange={(e) => set