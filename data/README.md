# Data Folder

This folder contains all centralized mock data for the Teacher Mobile App.

## Structure

```
data/
├── index.ts          # Main export file - import all data from here
├── classes.ts        # Classes and subjects data
├── students.ts       # Student names and generator functions
├── dashboard.ts      # Dashboard stats, notifications, and activities
└── README.md         # This file
```

## Usage

### Importing Data

Always import data from the main `index.ts` file:

```typescript
import {
  allClasses,
  generateStudents,
  dashboardStats,
  teacherProfile,
} from "@/data";
```

### Available Data

#### Classes (`classes.ts`)

- `allClasses` - Array of all class items
- `getSubjects()` - Get unique subjects list
- `getGrades()` - Get unique grades list

#### Students (`students.ts`)

- `studentNames` - Array of Pakistani student names
- `generateStudents(count)` - Generate mock students for a class

#### Dashboard (`dashboard.ts`)

- `teacherProfile` - Teacher information
- `dashboardStats` - Dashboard statistics
- `todayAttendance` - Today's attendance summary
- `initialNotifications` - Default notifications
- `classSchedule` - Class schedule for current/next class detection
- `recentActivities` - Recent activity feed

### Types

All TypeScript interfaces are also exported from the data folder:

```typescript
import {
  type Notification,
  type QuickAction,
  type RecentActivity,
  type ClassScheduleItem,
} from "@/data";
```

## Best Practices

1. **Never hardcode data** in components - always import from this folder
2. **Use the main index.ts** for imports - don't import directly from individual files
3. **Keep data organized** - if adding new data, create a new file and export it from index.ts
4. **Update types** - when adding new data structures, export their types as well

## Future Enhancements

When connecting to a real backend:

1. Replace mock data with API calls
2. Keep the same export structure for easy migration
3. Consider creating a separate `api/` folder for API calls
