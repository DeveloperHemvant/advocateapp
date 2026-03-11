## API base URL

Set `EXPO_PUBLIC_API_BASE_URL` (recommended) or keep the default:

- Android emulator default: `http://10.0.2.2:4000/api`
- iOS simulator / web default: `http://localhost:4000/api`

Example `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.50:4000/api
```

## Endpoints used by the app

### Advocate onboarding

`POST /api/auth/register`

Request:

```json
{
  "email": "adv1@example.com",
  "password": "secret123",
  "fullName": "Advocate One",
  "phone": "+91....",
  "barId": "ID-12345678",
  "experienceYears": 3,
  "practiceAreas": ["Criminal", "Civil"],
  "city": "Delhi",
  "state": "DL"
}
```

Response (example):

```json
{
  "id": "ck...",
  "email": "adv1@example.com",
  "fullName": "Advocate One",
  "phone": "+91....",
  "role": "ADVOCATE",
  "profileStatus": "PENDING",
  "createdAt": "2026-03-09T..."
}
```

### Advocate login

`POST /api/auth/login`

Request (supports email OR phone):

```json
{
  "emailOrPhone": "adv1@example.com",
  "password": "secret123"
}
```

Response (example):

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "ck...",
    "email": "adv1@example.com",
    "fullName": "Advocate One",
    "role": "ADVOCATE",
    "profileStatus": "PENDING",
    "practiceAreas": []
  }
}
```

### Refresh token

`POST /api/auth/refresh`

Request:

```json
{ "refreshToken": "eyJ..." }
```

### Logout

`POST /api/auth/logout`

Request:

```json
{ "refreshToken": "eyJ..." }
```

### Current advocate profile

- `GET /api/advocates/me` (Bearer access token)
- `PUT /api/advocates/me` (Bearer access token)

## App code

- `lib/apiConfig.ts`: resolves `API_BASE_URL` from env/defaults
- `lib/authStorage.ts`: stores tokens in `expo-secure-store`
- `lib/apiClient.ts`: fetch wrapper with automatic refresh on 401
- `lib/api.ts`: typed functions (`registerAdvocate`, `loginAdvocate`, `getMe`, `updateMe`, `logout`)

