# Frontend Standards

Stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod

Rules:

- Use the App Router only.
- Use the `src` directory.
- Follow the feature-based folder structure.
- Prefer Server Components where possible.
- Use Client Components only when required.
- Keep components small, reusable, and presentation-focused.
- Move business logic to hooks or services.
- Never call APIs directly from UI components.
- Use TanStack Query for server state.
- Use React Hook Form with Zod for forms.
- Use loading.tsx, error.tsx, and not-found.tsx where appropriate.
- Avoid prop drilling by using composition or context when necessary.
- Follow the project's design system consistently.
