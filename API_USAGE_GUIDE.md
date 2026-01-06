# Backend API Integration - Complete Guide

## Production-Ready Implementation (Urdu/Roman-Urdu)

**Last Updated:** 2026-01-06

---

## ✅ Kya Install Hua Hai

### New Packages

- **expo-secure-store** - Secure token storage (production-grade)
- **axios** - HTTP client with interceptors

### New Services Created

1. `services/secureStorage.ts` - Secure token management
2. `services/apiClient.ts` - Axios client with auto token injection
3. `services/api.ts` - Complete API service (updated)

---

## 🔐 Security Improvements

### BEFORE (Old Implementation)

```typescript
// ❌ AsyncStorage - Not encrypted
await AsyncStorage.setItem("authToken", token);
```

### AFTER (New Implementation)

```typescript
// ✅ SecureStore - Hardware-encrypted
await secureStorage.saveToken("authToken", token);
```

---

## 📡 API Client Features

### ✅ Automatic Token Injection

Har API call mein automatically Bearer token add hota hai:

```typescript
// You don't need to manually add Authorization header
const data = await apiService.get("/api/students");
```

### ✅ Error Handling

- **401 Unauthorized** → Automatically clears tokens
- **403 Forbidden** → Permission error logged
- **429 Rate Limit** → Rate limit message
- **500 Server Error** → Server error message

### ✅ Request Logging (Development)

Console mein har request ki details show hoti hain:

```
🚀 API Request: { method: 'POST', url: '/api/auth/login', hasToken: false }
✅ API Response: { url: '/api/auth/login', status: 200 }
```

---

## 🚀 How to Use

### 1. Login Example

```typescript
import { apiService } from "@/services/api";

const handleLogin = async (email: string, password: string) => {
  const response = await apiService.login(email, password);

  if ("success" in response && response.success) {
    console.log("Login successful!", response.user);
    // Token automatically saved
  } else {
    console.error("Login failed:", response.message);
  }
};
```

### 2. Get Current User

```typescript
const fetchUserProfile = async () => {
  const response = await apiService.getCurrentUser();

  if ("success" in response && response.success) {
    console.log("User:", response.user);
  }
};
```

### 3. Generic GET Request

```typescript
// Get students list
const students = await apiService.get("/api/students");

// Get specific student
const student = await apiService.get("/api/students/123");
```

### 4. Generic POST Request

```typescript
// Mark attendance
const result = await apiService.post("/api/attendance/mark", {
  studentId: "123",
  status: "present",
  date: "2026-01-06",
});
```

### 5. Upload File (Image/Document)

```typescript
import * as ImagePicker from "expo-image-picker";

const uploadProfilePicture = async () => {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const filename = `profile_${Date.now()}.jpg`;

    // Upload
    const response = await apiService.uploadFile(
      uri,
      filename,
      "image/jpeg",
      "/api/upload/profile"
    );

    if (response.success) {
      console.log("Upload successful:", response.data);
    }
  }
};
```

### 6. PUT Request (Update)

```typescript
// Update student info
const updated = await apiService.put("/api/students/123", {
  name: "Updated Name",
  grade: "10th",
});
```

### 7. DELETE Request

```typescript
// Delete assignment
await apiService.delete("/api/assignments/123");
```

---

## 📱 Complete Component Example

```typescript
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import { apiService } from "@/services/api";

function StudentsListScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiService.get("/api/students");
      setStudents(data.students || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await apiService.delete(`/api/students/${id}`);
      Alert.alert("Success", "Student deleted");
      fetchStudents(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Failed to delete student");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deleteStudent(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
```

---

## 🔧 Advanced Usage

### Custom Headers

```typescript
// If you need custom headers for a specific request
import apiClient from "@/services/apiClient";

const response = await apiClient.get("/api/special", {
  headers: {
    "X-Custom-Header": "value",
  },
});
```

### Timeout Configuration

```typescript
// Override default 30s timeout
const response = await apiClient.get("/api/long-process", {
  timeout: 60000, // 60 seconds
});
```

### Cancel Requests

```typescript
import axios from "axios";

const source = axios.CancelToken.source();

// Make request
apiClient.get("/api/data", {
  cancelToken: source.token,
});

// Cancel it
source.cancel("Request cancelled by user");
```

---

## 🔄 Migration from Old Code

### If you have old fetch calls:

**BEFORE:**

```typescript
const token = await AsyncStorage.getItem("authToken");
const response = await fetch("http://192.168.1.244:3000/api/students", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
```

**AFTER:**

```typescript
// Much simpler!
const data = await apiService.get("/api/students");
```

---

## 📝 API Endpoints Available

Based on your backend guide:

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/api/auth/login`      | Login with email/password |
| GET    | `/api/auth/me`         | Get current user profile  |
| GET    | `/api/students`        | List all students         |
| POST   | `/api/attendance/mark` | Mark attendance           |
| POST   | `/api/upload`          | Upload file               |

**Add more endpoints in `config/api.ts`:**

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout", // Add new
  },
  STUDENTS: {
    LIST: "/api/students",
    DETAILS: "/api/students/:id",
    CREATE: "/api/students",
  },
};
```

---

## ⚠️ Important Notes

### 1. BASE_URL Configuration

Update in `config/api.ts`:

```typescript
export const BASE_URL = "https://your-backend.example.com/api";
```

### 2. Token Expiry

Agar 401 error aaye, token expire ho gaya:

- Axios interceptor automatically clear karega
- User ko login screen pe redirect hoga

### 3. Offline Mode

SecureStore cache karta hai, so agar internet nahi hai:

- Token available rahega
- API calls fail hongi with network error

### 4. File Uploads

- Do NOT set `Content-Type` for FormData
- Let fetch/axios set it automatically with boundary

---

## 🧪 Testing

### Test with Postman First

1. POST `/api/auth/login` → Get token
2. Copy token
3. Set header `Authorization: Bearer <token>`
4. Test other endpoints

### Mobile App Testing

1. Check console logs for requests
2. Verify token is saved
3. Test logout and re-login 4. Try file upload with real image

---

## 🔒 Security Checklist

- ✅ Using expo-secure-store (encrypted)
- ✅ No tokens in console logs (production)
- ✅ HTTPS only (production)
- ✅ Auto token injection via interceptor
- ✅ 401 handling with auto-logout
- ✅ No hardcoded credentials

---

## 🎯 Next Steps

1. **Update BASE_URL** to your production backend
2. **Test login** with real credentials
3. **Add more API endpoints** as needed
4. **Implement refresh token** (if backend supports)
5. **Add offline caching** for better UX

---

## 💡 Pro Tips

### Tip 1: Type Safety

Define interfaces for API responses:

```typescript
interface Student {
  id: string;
  name: string;
  grade: string;
}

const students = await apiService.get<Student[]>("/api/students");
```

### Tip 2: Loading States

Always show loading indicators:

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiService.get("/api/data");
  } finally {
    setLoading(false);
  }
};
```

### Tip 3: Error Messages

Show user-friendly errors:

```typescript
try {
  await apiService.post("/api/action");
} catch (error: any) {
  Alert.alert("Error", error.message || "Something went wrong");
}
```

---

## 📚 Documentation Links

- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Native FormData](https://reactnative.dev/docs/network#using-formdata)

---

**Integration Complete! Ab aap production-ready backend integration use kar sakte hain! 🚀**

For support, check console logs or refer to `BACKEND_API_INTEGRATION.md`.
