# Supabase Implementation Patterns

## Type Definitions

- **Database Interface**: Keep `src/types/database.ts` updated with the actual schema.
- **Row vs relations**: `Row` types should strictly match the table columns. Joined data (e.g., `products(name)`) should be handled via intersection types locally in the hook/page or in a specific "WithRelations" type.
- **Mutation Safety**: To prevent `Argument of type ... is not assignable to parameter of type 'never'`, ensure:
  1. The `Insert` and `Update` types in `database.ts` are correctly mapped from the `Row`.
  2. If issues persist, use `Partial<Table['Row']>` for `Update` entries in the `Database` interface.

## Error Handling

- Always check the `error` object returned from Supabase calls.
- Convert Supabase errors to standard `Error` objects or user-friendly messages before displaying.

## RPC Calls

- When using `.rpc()`, ensure the function exists in the database and the parameters match the expected typed interface in `database.ts`.
