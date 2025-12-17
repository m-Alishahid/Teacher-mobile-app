# Sidebar Drawer Implementation Guide

## Overview

A professional LinkedIn-style sidebar drawer has been implemented in the Teacher Mobile App. The sidebar provides quick access to profile options, settings, and logout functionality.

## Features

### 1. **Hamburger Menu Button**

- Located in the top-left corner of every screen header
- Opens the sidebar drawer with a smooth slide-in animation
- Visible across all tabs (Dashboard, Classes, Attendance, Profile)

### 2. **Sidebar Components**

#### Header Section

- **Gradient Background**: Beautiful indigo/purple gradient
- **Profile Avatar**: Displays teacher's initials
- **Edit Badge**: Quick access to edit profile
- **Teacher Information**:
  - Full name
  - Designation
  - Employee ID

#### Quick Stats Row

- **Classes**: Total number of classes (8)
- **Students**: Total number of students (245)
- **Rating**: Teacher rating (4.8)
- Color-coded for visual appeal

#### Menu Sections

**ACCOUNT Section:**

- **My Profile**: View and edit profile information
- **Settings**: Access preferences and privacy settings
- **Notifications**: Manage alerts (shows badge count)

**SUPPORT Section:**

- **Help & Support**: Access FAQs and contact support
- **About**: View app version and information

#### Footer

- **Logout Button**: Styled with error colors for emphasis
- **Copyright**: App branding and year

### 3. **Animations**

- Smooth slide-in from left
- Backdrop fade-in effect
- Spring animation for natural feel
- Smooth close animation

### 4. **User Interactions**

- **Open**: Click hamburger menu icon in header
- **Close**:
  - Click close (X) button in sidebar
  - Tap on backdrop/overlay
  - Press device back button (Android)
- **Navigate**: Click any menu item to navigate
- **Logout**: Confirmation alert before logout

## Technical Implementation

### Files Created/Modified

1. **Created**: `components/ui/SidebarDrawer.tsx`

   - Main sidebar component
   - Animated drawer with backdrop
   - Menu items with icons and badges
   - Responsive design

2. **Modified**: `app/(tabs)/_layout.tsx`
   - Added hamburger menu button to header
   - Integrated SidebarDrawer component
   - Added logout confirmation alert
   - State management for sidebar visibility

### Key Technologies

- **React Native**: Core framework
- **Expo Router**: Navigation
- **Animated API**: Smooth animations
- **Linear Gradient**: Beautiful header gradient
- **Ionicons**: Consistent iconography
- **Theme Context**: Dynamic theming support

## Usage

### Opening the Sidebar

```typescript
// The sidebar opens when user clicks the menu icon
<TouchableOpacity onPress={() => setSidebarVisible(true)}>
  <Ionicons name="menu" size={28} />
</TouchableOpacity>
```

### Closing the Sidebar

```typescript
// Multiple ways to close:
// 1. Close button
// 2. Backdrop press
// 3. After navigation
onClose={() => setSidebarVisible(false)}
```

### Logout Flow

```typescript
// Logout with confirmation
const handleLogout = () => {
  showAlert(
    "Logout",
    "Are you sure you want to end your session?",
    "power",
    colors.status.error.main,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]
  );
};
```

## Customization

### Adding New Menu Items

```typescript
<MenuItem
  icon="your-icon-name"
  title="Menu Title"
  subtitle="Optional subtitle"
  onPress={() => handleAction()}
  color={colors.primary.main}
  showBadge={true}
  badgeCount={5}
/>
```

### Changing Drawer Width

```typescript
// In SidebarDrawer.tsx
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width
```

### Modifying Animations

```typescript
// Adjust spring animation
Animated.spring(slideAnim, {
  toValue: 0,
  tension: 65, // Increase for faster animation
  friction: 11, // Decrease for bouncier effect
});
```

## Design Principles

1. **Consistency**: Matches app's overall design language
2. **Accessibility**: Large touch targets, clear labels
3. **Performance**: Optimized animations, minimal re-renders
4. **Responsiveness**: Works on all screen sizes
5. **Theming**: Supports both light and dark modes

## Future Enhancements

- [ ] Add profile picture upload
- [ ] Implement notification center
- [ ] Add recent activity section
- [ ] Swipe gesture to open drawer
- [ ] Customizable menu items
- [ ] User preferences for drawer behavior

## Testing Checklist

- [x] Sidebar opens smoothly
- [x] Backdrop dismisses sidebar
- [x] Close button works
- [x] Menu items navigate correctly
- [x] Logout confirmation appears
- [x] Animations are smooth
- [x] Works in light mode
- [x] Works in dark mode
- [x] Responsive on different screen sizes
- [x] Back button closes sidebar (Android)

## Troubleshooting

### Sidebar not opening?

- Check if `sidebarVisible` state is updating
- Verify SidebarDrawer component is rendered
- Check for console errors

### Animations choppy?

- Ensure `useNativeDriver: true` is set
- Check device performance
- Reduce animation complexity if needed

### Menu items not clickable?

- Verify `onPress` handlers are defined
- Check if backdrop is blocking touches
- Ensure `activeOpacity` is set

## Credits

Designed and implemented following LinkedIn's sidebar pattern with custom enhancements for the Teacher Mobile App.

---

**Version**: 1.0.0  
**Last Updated**: December 18, 2025  
**Author**: Antigravity AI Assistant
