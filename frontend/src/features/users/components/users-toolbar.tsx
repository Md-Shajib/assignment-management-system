import { SearchField } from "@/shared/components/ui/search-field";
import { Select } from "@/shared/components/ui/select";

/**
 * Search and filtering are rendered as designed but inert: `GET /users` accepts
 * only `page` and `pageSize` (docs/04-API-DESIGN.md §8.2).
 */
const UNAVAILABLE = "Filtering is not supported by the API yet";

export function UsersToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-muted p-4">
      <SearchField
        className="w-full sm:max-w-xs"
        placeholder="Search users by name or email..."
        aria-label="Search users by name or email"
        disabled
        title={UNAVAILABLE}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select aria-label="Filter by role" disabled title={UNAVAILABLE} defaultValue="all">
          <option value="all">Role: All</option>
        </Select>
        <Select aria-label="Filter by status" disabled title={UNAVAILABLE} defaultValue="all">
          <option value="all">Status: All</option>
        </Select>
      </div>
    </div>
  );
}
