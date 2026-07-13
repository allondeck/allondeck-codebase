# Coding Standards

To ensure codebase health and minimize recurring lint/type errors, follow these standards:

## 1. Type Safety

- **No `any`**: Avoid `as any` or the `any` type. Use proper interfaces or `unknown` with type guards if necessary.
- **Supabase Mutations**: If a mutation (insert/update) fails with a `never` type error, ensure the `Row` type in `database.ts` does not contain any joined/relationship fields that aren't real columns.
- **Explicit Returns**: Always define return types for complex functions and hooks.

## 2. React Hooks

- **useEffect Dependencies**: Never use the `.join(',')` trick to stabilize array dependencies. Instead:
  - Wrap the array creation in `useMemo` in the caller.
  - Or use a reference-stable identity if the array is static.
- **Stable Callbacks**: Wrap functions passed as dependencies (or returned from hooks) in `useCallback`.

## 3. Fast Refresh (Vite)

- **Component Files**: Files ending in `.tsx` that export React components should **ONLY** export components.
- **Move Constants/Types**: Move types, interfaces, constants, and helper functions (like `isProductCartItem`) to separate `.ts` files in `src/types/` or `src/lib/` to avoid `react-refresh/only-export-components` warnings.

## 4. CSS & Styling

- **Positioning**: Do not combine `relative` and `sticky` on the same element if it triggers lint warnings; `sticky` implies the necessary positioning behavior.
- **Consistency**: Use the Tailwind classes provided by the design system rather than ad-hoc styles.
