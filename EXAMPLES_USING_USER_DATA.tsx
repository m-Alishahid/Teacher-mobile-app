/**
 * EXAMPLE: How to use real user data from backend in the Dashboard
 *
 * This file shows how to replace dummy data with real API user data.
 * Copy the relevant sections into your actual dashboard file.
 */

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// Example 1: Display User Name from Backend
export function DashboardHeaderExample() {
  const { user, isLoggedIn } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      {/* BEFORE: Used dummy teacherProfile.name */}
      {/* AFTER: Use real user data from backend */}
      <Text style={styles.teacherName}>{user?.name || "Teacher"}</Text>
    </View>
  );
}

// Example 2: Access User Fields in Any Component
export function UserInfoExample() {
  const { user, isLoggedIn, refreshUser } = useAuth();

  // Refresh user data when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      refreshUser(); // Get latest data from backend
    }
  }, []);

  if (!isLoggedIn || !user) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Role: {user.role}</Text>

      {/* Access additional fields if your backend provides them */}
      {user.phone && <Text>Phone: {user.phone}</Text>}
      {user.department && <Text>Department: {user.department}</Text>}
    </View>
  );
}

// Example 3: Conditional Rendering Based on User Role
export function RoleBasedComponentExample() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <View>
        <Text>Admin Dashboard</Text>
        <Button title="Manage Users" />
        <Button title="View Reports" />
      </View>
    );
  }

  if (user?.role === "teacher") {
    return (
      <View>
        <Text>Teacher Dashboard</Text>
        <Button title="My Classes" />
        <Button title="Attendance" />
      </View>
    );
  }

  return <Text>Unknown role</Text>;
}

// Example 4: Making Authenticated API Calls
export function FetchUserDataExample() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);

  const fetchMyClasses = async () => {
    try {
      // Get token for authenticated request
      const token = await apiService.getToken();

      // Make API call with token
      const response = await fetch(
        "http://192.168.1.244:3000/api/teacher/classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setClasses(data.classes);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, []);

  return (
    <View>
      <Text>Classes for {user?.name}:</Text>
      {classes.map((cls) => (
        <Text key={cls.id}>{cls.name}</Text>
      ))}
    </View>
  );
}

// Example 5: Update Dashboard to Replace teacherProfile Dummy Data
export function UpdatedDashboardExample() {
  const { user } = useAuth(); // ← ADD THIS

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>

          {/* BEFORE: {teacherProfile.name} */}
          {/* AFTER: Use real user from backend */}
          <Text style={styles.teacherName}>{user?.name || "Teacher"}</Text>
        </View>
      </View>

      {/* Rest of dashboard */}
    </SafeAreaView>
  );
}

// Example 6: Replace Static Data with User-Specific Backend Data
export function ReplaceStaticDataExample() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = await apiService.getToken();

      const response = await fetch(
        "http://192.168.1.244:3000/api/teacher/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {/* BEFORE: Used static dashboardStats */}
      {/* AFTER: Use dynamic stats from backend */}
      <StatsCard
        type="students"
        value={stats?.totalStudents || 0}
        label="Students"
      />
      <StatsCard
        type="attendance"
        value={stats?.todayAttendancePercent || 0}
        label="Attendance"
        isPercentage
      />
    </View>
  );
}

/**
 * IMPLEMENTATION STEPS:
 *
 * 1. Import useAuth in your dashboard:
 *    import { useAuth } from '@/context/AuthContext';
 *
 * 2. Get user data:
 *    const { user, isLoggedIn } = useAuth();
 *
 * 3. Replace teacherProfile.name with user?.name:
 *    <Text>{user?.name}</Text>
 *
 * 4. Create backend endpoints for:
 *    - GET /api/teacher/stats (dashboard statistics)
 *    - GET /api/teacher/classes (teacher's classes)
 *    - GET /api/teacher/attendance (attendance data)
 *
 * 5. Replace dummy data imports with API calls
 *
 * 6. Add loading states while fetching
 *
 * 7. Handle errors gracefully
 */

export default {
  note: "This is an example file. Copy relevant code into your actual components.",
};
