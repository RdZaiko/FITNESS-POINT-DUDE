# Tuition Website — Local Preview Setup

Yeh project abhi local-only preview mode mein hai. Application code Supabase client initialize nahi karta aur Supabase network request nahi bhejta. Is preview ke liye Supabase account, internet connection ya credentials ki zaroorat nahi hai.

## Website chalane ke steps

Abhi Codex workspace ka dev server port **3001** par chal raha hai. Browser mein [http://localhost:3001](http://localhost:3001) kholiye. Server chal raha ho tab tak Codex session khula rakhiye.

Agar server ruk jaaye, Windows mein PowerShell kholiye aur yeh steps kijiye:

1. Project folder mein jaiye:

   ```powershell
   cd "C:\Users\SD PRINCE\OneDrive\Documents\ChatGPT\tution"
   ```

2. Is project ke pehle se installed Next.js se server chalaaiye:

   ```powershell
   $env:NEXT_DIST_DIR = ".next-local-preview-check"
   node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3001
   ```

3. Terminal mein `Ready` dikhne ke baad [http://localhost:3001](http://localhost:3001) kholiye. PowerShell window band na karein.

Is Codex Windows workspace mein `pnpm dev` ne pnpm store ke liye symlink banate waqt `EPERM` error diya. Isliye upar diye gaye direct Next.js command ka istemal kijiye; Node.js ya dependencies dobara install karne ki zaroorat nahi hai.

Login preview ke liye `/login` par jaakar **Preview as student** ya **Preview as teacher** dabaiye. Yeh local-only synthetic sample session hai, real account nahi. Course checkpoints aur weekly goal sirf isi browser ke local storage mein save hote hain; kisi database mein nahi. Registration, profile saving, batch/enrollment changes, announcements aur material upload/download database se connected nahi hain. Contact form aapka email app kholta hai, website se message nahi bhejta.

## `.env.local` aur credentials

Maujooda `.env.local` ko jaisa hai waisa hi rakha gaya hai. Next.js us file ko process environment mein load kar sakta hai, lekin local preview ka application code Supabase client nahi banata aur uske values ka istemal karke Supabase se connect nahi karta. Isliye preview chalane ke liye `.env.local` banana ya edit karna zaroori nahi. Kisi bhi secret ko chat mein paste na karein; is kaam mein secret values dikhayi nahi gayi hain.

Mux ke server routes source mein maujood hain, lekin local preview private recorded-video playback aur real live-class operations ko band rakhta hai. Mux credentials ka file mein hona unke valid hone ya video workflow chalne ka saboot nahi hai. Real video/live features ke liye pehle verified Supabase accounts aur database access dobara implement karna hoga.

## Supabase SQL files

`supabase/` folder ke schema, migrations aur setup SQL ko suraksha ke liye rakha gaya hai. App unhe nahi chalata. Is task mein kisi hosted database, table, migration, account ya user ko badla nahi gaya.

Existing `learning-room` project se app ko dobara jodne ke liye Supabase clients, authentication, authorization, database/storage API routes ko baad mein dobara implement aur verify karna hoga. Filhaal project connected nahi hai.

## Checks chalane ke commands

Is workspace mein pnpm `EPERM` de to, installed tools ko seedha chalane ke liye:

```powershell
node node_modules/eslint/bin/eslint.js
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
$env:NEXT_DIST_DIR = ".next-build-preview"
node node_modules/next/dist/bin/next build --webpack
```
