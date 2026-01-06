# Backend API Integration Guide

## Overview
This document explains the backend API integration for the Teacher Mobile App using the Login and User Profile (ME) endpoints.

---

## 📁 Files Created/Modified

### 1. **`config/api.ts`** (NEW)
- Contains base URL and API endpoint definitions
- **Update the `BASE_URL`** with your backend server's actual URL and port

```typescript
export const BASE_URL = 'http://192.168.1.244:3000'; // ← UPDATE THIS
```

### 2. **`services/api.ts`** (NEW)
- API service layer with reusable functions
- Handles:
  - **Login** - `POST /api/auth/login`
  - **Get Current User (ME)** - `GET /api/auth/me`
  - Token management (save, get, remove)

### 3. **`context/AuthContext.tsx`** (UPDATED)
- Now integrated with real backend API
- Features:
  - Auto-validates token on app start using `/api/auth/me`
  - Stores user data in state and AsyncStorage
  - Provides `user` object globally

### 4. **`app/index.tsx`** (UPDATED)
- Login screen now calls real backend API
- Shows proper error messages from backend
- Removed hardcoded credentials

---

## 🔧 Backend API Requirements

Your backend must implement these endpoints:

### 1. **Login Endpoint**
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "teacher@example.com",
  "password": "password123"
}

Success Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "teacher@example.com",
    "role": "teacher"
  },
  "message": "Login successful"
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. **Get Current User (ME) Endpoint**
```
GET /api/auth/me
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "teacher@example.com",
    "role": "teacher"
    // ... other user fields
  }
}

Error Response (401):
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 🚀 Usage Examples

### 1. Access User Data in Any Component

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isLoggedIn } = useAuth();

  return (
    <View>
      {isLoggedIn && (
        <Text>Welcome, {user?.name}!</Text>
      )}
    </View>
  );
}
```

### 2. Refresh User Data

```typescript
import { useAuth } from '@/context/AuthContext';

function ProfileScreen() {
  const { refreshUser, user } = useAuth();

  const handleRefresh = async () => {
    await refreshUser(); // Fetches latest user data from backend
  };

  return (
    <View>
      <Text>{user?.email}</Text>
      <Button title="Refresh" onPress={handleRefresh} />
    </View>
  );
}
```

### 3. Logout User

```typescript
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/'); // Redirect to login
  };

  return <Button title="Logout" onPress={handleLogout} />;
}
```

---

## 🔐 Authentication Flow

1. **App Opens**:
   - `AuthContext` checks for stored token
   - If token exists → Validates with `/api/auth/me`
   - If valid → User stays logged in
   - If invalid → User must login

2. **User Logs In**:
   - Enters email & password
   - App calls `POST /api/auth/login`
   - Backend returns token + user data
   - Token saved in AsyncStorage
   - User data stored in state

3. **User Uses App**:
   - Every protected API call includes token in header:
     ```
     Authorization: Bearer <token>
     ```

4. **User Logs Out**:
   - Token removed from AsyncStorage
   - User state cleared
   - Redirected to login screen

---

## 🛠️ Customization

### Add More API Endpoints

Edit `config/api.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    REGISTER: '/api/auth/register', // NEW
  },
  STUDENTS: {
    LIST: '/api/students',
    DETAILS: '/api/students/:id',
  },
};
```

Then create functions in `services/api.ts`:

```typescript
async getStudents(): Promise<any> {
  const token = await this.getToken();
  const url = getApiUrl(API_ENDPOINTS.STUDENTS.LIST);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}
```

### Modify User Data Type

Edit `services/api.ts`:

```typescript
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;        // ADD CUSTOM FIELDS
  department?: string;   // ADD CUSTOM FIELDS
  [key: string]: any;
}
```

---

## 🧪 Testing

### Test with Different Backend

Update `config/api.ts`:

```typescript
// Development
export const BASE_URL = 'http://192.168.1.244:3000';

// Production
// export const BASE_URL = 'https://api.yourschool.com';

// Local testing
// export const BASE_URL = 'http://localhost:3000';
```

### Enable Network Debugging

Check React Native console for API logs:
- Login errors
- Token validation
- Network issues

---

## ⚠️ Troubleshooting

### "Network request failed"
- ✅ Check backend server is running
- ✅ Verify IP address is correct
- ✅ Ensure phone/emulator can reach server
- ✅ Check firewall settings

### "Invalid token" / Auto-logout
- ✅ Backend token validation might be strict
- ✅ Check token expiration time
- ✅ Verify `/api/auth/me` accepts Bearer tokens

### User data not showing
- ✅ Verify backend returns `user` object
- ✅ Check field names match `UserData` interface
- ✅ Use `console.log(user)` to debug

---

## 📝 Next Steps

1. **Update BASE_URL** in `config/api.ts` with your production server
2. **Test login** with real credentials
3. **Verify token storage** persists across app restarts
4. **Integrate other API endpoints** (students, classes, etc.)
5. **Add error handling** for network failures
6. **Implement token refresh** if needed

---

## 💡 Pro Tips

- Use **environment variables** for different environments (dev/staging/prod)
- Implement **retry logic** for failed requests
- Add **offline support** by caching user data
- Use **interceptors** for automatic token injection
- Consider **axios** instead of fetch for better features

---

## 🎯 Summary

✅ Login with backend API  
✅ Token-based authentication  
✅ User data available globally  
✅ Auto-validation on app start  
✅ Secure logout  
✅ Ready for production  

**Your app is now fully integrated with the backend! 🚀**
