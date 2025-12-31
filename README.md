## Licensing and Terms of Use

This project is licensed under the **GNU General Public License v3 (GPL-3.0)**. 

### For Developers
You are welcome to fork this repository, contribute to the codebase, and use it for personal, non-commercial educational purposes. However, under the terms of the GPL-3.0:
* Any derivative work must also be licensed under the GPL-3.0.
* You must provide the source code of any application built using this codebase.
* You may not use this application or its data for commercial profit without explicit written consent from the author.

### Data Ownership
The curated database of names and meanings contained within `src/data/data.ts` represents significant research and intellectual effort. Unauthorized scraping or commercial redistribution of this dataset is strictly prohibited.

---------------------------------------------------------------

## Neshama Baby Names
Neshama Baby Names is a high-performance name discovery engine built with Next.js and TypeScript. It serves as a curated digital repository for Hebrew and English names, providing etymological data, original Hebrew script, and phonetic transliterations.

The application is designed for speed and reliability, utilizing static data structures to provide an instantaneous search and filtering experience without the overhead of external database latency.

Technical Specifications
Core Framework: Next.js 14+ (App Router)

Type Safety: TypeScript

Styling: Tailwind CSS (Mobile-first responsive design)

Iconography: Lucide-React

Client-Side Persistence: LocalStorage API for "Favorite Names" functionality.

Optimization: useMemo hooks for efficient filtering of large datasets.

Architecture and Data Design
The application utilizes a standardized, strictly typed object schema for all name entries. Data is centralized in src/data/data.ts to facilitate easy maintenance and scalability.

### Data Interface
export interface NameEntry {
  id: string;              // Unique ID with categorical prefix
  hebrew: string;          // Traditional script with niqqud
  transliteration: string; // Phonetic English equivalent
  english: string;         // Standardized English spelling
  meaning: string;         // Etymological and cultural definition
  gender: 'male' | 'female' | 'neutral';
  nameType: 'hebrew' | 'english';
}


## Neshama Baby Names
Neshama Baby Names is a high-performance name discovery engine built with Next.js and TypeScript. It serves as a curated digital repository for Hebrew and English names, providing etymological data, original Hebrew script, and phonetic transliterations.

The application is designed for speed and reliability, utilizing static data structures to provide an instantaneous search and filtering experience without the overhead of external database latency.

Technical Specifications
Core Framework: Next.js 14+ (App Router)

Type Safety: TypeScript

Styling: Tailwind CSS (Mobile-first responsive design)

Iconography: Lucide-React

Client-Side Persistence: LocalStorage API for "Favorite Names" functionality.

Optimization: useMemo hooks for efficient filtering of large datasets.

Architecture and Data Design
The application utilizes a standardized, strictly typed object schema for all name entries. Data is centralized in src/data/data.ts to facilitate easy maintenance and scalability.

Data Interface
TypeScript

export interface NameEntry {
  id: string;              // Unique ID with categorical prefix
  hebrew: string;          // Traditional script with niqqud
  transliteration: string; // Phonetic English equivalent
  english: string;         // Standardized English spelling
  meaning: string;         // Etymological and cultural definition
  gender: 'male' | 'female' | 'neutral';
  nameType: 'hebrew' | 'english';
}

### Indexing Convention
To ensure data integrity and prevent identifier collisions, the following prefixing system is implemented:

hm: Hebrew Male (Current range: hm101–hm150)

hf: Hebrew Female (Current range: hf101–hf129)

em: English Male

ef: English Female

### Development Setup
To initialize the development environment:

Clone the repository:
git clone https://github.com/Baxbyte/Neshama-Baby-Names.git

Install dependencies:
npm install

Run development server:
npm run dev

Production build:
npm run build

## Contribution
Developers wishing to contribute new names or features should:

Follow the existing id sequencing for the respective category.

Ensure Hebrew script includes correct vowel points (niqqud).

Maintain the strict TypeScript interface definitions during implementation.

