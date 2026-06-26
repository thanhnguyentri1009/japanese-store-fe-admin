# Japanese Store — Admin Frontend

Vite + React 19 + TypeScript admin panel. Backend API docs at `http://localhost:3000/docs`.

## Stack

| Layer | Library |
|---|---|
| UI | Ant Design (antd) v6 |
| Routing | React Router DOM v7 |
| Server state / mutations | @tanstack/react-query |
| HTTP | Axios (custom instances in `src/services/axios.ts`) |
| Utilities | lodash |

## Project Structure

```
src/
├── App.tsx                  — Root: QueryClientProvider > ConfigProvider > BrowserRouter
├── AppContainer.tsx         — Auth guard, layout switcher
├── Routers.tsx              — Route table
├── main.tsx                 — Entry point
│
├── commons/
│   └── constants/
│       ├── index.ts         — TOKEN_KEY, titles, NOT_FOUND
│       └── routers.ts       — routers{} and navigators{} maps
│
├── layouts/
│   ├── AdminLayout.tsx      — Sidebar + header for authenticated pages
│   └── LoginLayout.tsx      — Minimal wrapper for public pages
│
├── pages/
│   └── <Feature>/
│       └── <Feature>.tsx    — Page component only (no service/type logic here)
│
├── services/
│   ├── axios.ts             — defaultAxios + uploadAxios with interceptors
│   └── <feature>/
│       └── <Feature>Service.ts
│
├── types/
│   └── <feature>.ts         — Request/response/payload interfaces
│
└── utils/
    └── localStorage.ts      — localStorageService wrapper + LOCAL_STORAGE_KEYS
```

## Naming Conventions

- **Pages**: `src/pages/<Feature>/<Feature>.tsx` — folder and file both PascalCase
- **Services**: `src/services/<feature>/<Feature>Service.ts`
- **Types**: `src/types/<feature>.ts`
- **Layouts**: `src/layouts/<Name>Layout.tsx`

## API Calls

All endpoint paths are defined in `src/commons/constants/apiIUrl.ts` as the `API` object. Always import from there — never hardcode path strings in services.

Always use `defaultAxios` from `src/services/axios.ts`. Base URL comes from `VITE_API_URL` env var.

```ts
// src/services/login/LoginService.ts
import defaultAxios from '../axios'
import type { LoginRequest, LoginResponse } from '../../types/login'

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await defaultAxios.post<LoginResponse>('/api/auth/login', data)
  return res.data
}
```

Use `useMutation` (not raw fetch/axios) inside page components:

```ts
const { mutate, isPending } = useMutation({
  mutationFn: featureService,
  onSuccess: (data) => { ... },
  onError: () => { ... },
})
```

## Auth

- Access token stored in localStorage under key `TOKEN_KEY = 'access_token'`
- User info stored under `LOCAL_STORAGE_KEYS.user = 'user'`
- `AppContainer.tsx` is the auth guard — it reads both values and redirects accordingly
- JWT decoded manually with `atob()` on `token.split('.')[1]`; role can be `string` or `{ id, name }` object
- Public routes (no auth required): `/login`, `/forgot-password`, `/reset-password`, `/activate`
- `defaultAxios` interceptor auto-attaches Bearer token and handles 401 token refresh

## Adding a New Feature (typical pattern)

1. **Type** — `src/types/<feature>.ts`: define request/response interfaces
2. **Service** — `src/services/<feature>/<Feature>Service.ts`: export async functions using `defaultAxios`
3. **Page** — `src/pages/<Feature>/<Feature>.tsx`: use `useMutation` / `useQuery`, import from services & types
4. **Route** — add entry to `routes[]` in `src/Routers.tsx` and `routers` in `src/commons/constants/routers.ts`

## Axios Instances

| Instance | Use case |
|---|---|
| `defaultAxios` | All standard JSON API calls |
| `uploadAxios` | File/image uploads (sets `Content-Type: multipart/form-data`) |

Both instances share the same 401-refresh + 403-redirect logic via interceptors.

## UI Conventions

- Use Ant Design components exclusively; do not introduce other UI libraries
- Primary color: `#e63946` (configured globally in `App.tsx`)
- `message.useMessage()` for toast notifications (not the static `message` API)
- `antd` locale is set to `vi_VN`
