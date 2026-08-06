# Frontend Architecture

Folder Structure:

```text
src/
├── app/
├── features/
│   └── <feature>/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── utils/
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── types/
│   ├── utils/
│   └── constants/
├── styles/
└── config/
```

Rules:

- Follow the feature-based architecture.
- Keep UI and business logic separate.
- Components should only render UI.
- Business logic belongs in hooks or services.
- API communication belongs in the API/service layer.
- Validation belongs in schemas.
- Shared components belong in `shared/`.
- Keep dependencies one-directional.
- Avoid tight coupling between features.
