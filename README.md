changefordeploy# Project Conventions & Contribution Guidelets gohmm it should workfordeploy
lol

## Folder Structure & Naming Conventions
lets gp
- **All file names must use kebab-case** (e.g., `my-component.tsx`, `home-page.tsx`, `admin-layout.tsx`).
m,lcfmdf,for deploy
  - This applies to pages, components, layouts, hooks, stores, and utility files.
  - Avoid PascalCase, camelCase, or snake_case for file names.
 minor change for deployment
- **Pages** (`src/pages/`):
- some change

  - Each file represents a route/page (e.g., `home-page.tsx`).
  - Export a default React component.

- **Components** (`src/components/`):

  - Reusable UI elements.
  - Use PascalCase for component names inside files, but file names must be kebab-case (e.g., `user-card.tsx`).
  - Group related components in folders if needed.

- **Layouts** (`src/layouts/`):

  - Layout wrappers for pages (e.g., `admin-layout.tsx`).

- **Hooks** (`src/hooks/`):

  - Custom React hooks (e.g., `use-auth.ts`).

- **Store/State** (`src/store/`):

  - State management logic (e.g., `user-store.ts`).

- **Lib/Utils** (`src/lib/`):

  - Utility functions and helpers (e.g., `format-date.ts`).

- **UI Library** (`src/components/ui/`):
  - Atomic UI components (e.g., `button.tsx`, `input.tsx`).

## General Naming Guidelines

- **Components:** PascalCase (e.g., `MyComponent`)
- **Files/Folders:** kebab-case (e.g., `user-profile.tsx`, `admin-layout.tsx`)
- **Variables/Functions:** camelCase
- **Constants/Enums:** UPPER_SNAKE_CASE

## How to Contribute

1. **Fork the repository** and clone your fork.
2. **Create a new branch** for your feature or bugfix:
   ```sh
   git checkout -b your-name
   ```
3. **Follow the conventions above** for naming and structure.
4. **Write clear, concise commit messages.**
5. **Test your changes locally.**
6. **Push your branch** and open a Pull Request (PR) to the `main` branch.

---

For questions, open an issue or contact the maintainers.
