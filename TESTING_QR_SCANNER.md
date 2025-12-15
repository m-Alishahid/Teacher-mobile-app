# Testing the QR Scanner - Quick Guide

## How to Test the QR Scanner Feature

### Step 1: Generate Test QR Codes

You can generate QR codes for testing using any online QR code generator. Here are some options:

**Recommended Sites:**

- https://www.qr-code-generator.com/
- https://www.the-qrcode-generator.com/
- https://qr.io/

**QR Code Data to Generate:**

For Student IDs (generate these):

```
1
2
3
4
5
```

For Roll Numbers (generate these):

```
001
002
003
004
005
```

### Step 2: Open the App

1. Make sure the Expo development server is running
2. Open the app on your phone or emulator
3. Navigate to the **Attendance** tab (third tab in bottom navigation)

### Step 3: Access the Scanner

1. You'll see the attendance screen with the current class
2. Look for the **QR code icon** in the top-right corner of the header
3. Tap the QR icon to open the scanner

### Step 4: Grant Camera Permission

**First Time Only:**

- The app will ask for camera permission
- Tap **"Grant Permission"**
- If you accidentally deny, you can grant it later from phone settings

### Step 5: Scan QR Codes

1. Point your phone camera at the QR code
2. Make sure the QR code is within the scanning frame (the square with corners)
3. The scanner will automatically detect and process the QR code

**What Happens:**

- ✅ If student is in current class → Green success message appears
- ✅ Student name and roll number are displayed
- ✅ Attendance is automatically marked as "Present"
- ✅ Stats update in real-time
- ❌ If student not in class → Error alert appears

### Step 6: Verify Attendance

1. Close the scanner (tap X button)
2. Scroll through the student list
3. You'll see the scanned students marked as "Present" (green radio button)
4. The stats at the top will show updated counts

## Testing Scenarios

### ✅ Valid Scan

**Test:** Scan QR code with data "1" or "001"
**Expected:**

- Success message shows "Ahmed Ali"
- Student marked as Present
- Green checkmark animation

### ❌ Invalid Scan

**Test:** Scan QR code with data "999"
**Expected:**

- Error alert: "Student Not Found"
- No attendance marked
- Can scan again after closing alert

### 🔄 Multiple Scans

**Test:** Scan multiple students one after another
**Expected:**

- 2-second cooldown between scans
- Each student marked individually
- Stats update after each scan

### 📊 Real-time Stats

**Test:** Watch the stats panel while scanning
**Expected:**

- "Total Students" stays at 32
- "Marked" increases with each scan
- "Remaining" decreases with each scan

## Current Class Students (Mock Data)

The scanner will work for these students in the current class:

| Student ID | Roll Number | Name           |
| ---------- | ----------- | -------------- |
| 1          | 001         | Ahmed Ali      |
| 2          | 002         | Fatima Hassan  |
| 3          | 003         | Hassan Ahmed   |
| 4          | 004         | Ayesha Malik   |
| 5          | 005         | Usman Tariq    |
| ...        | ...         | ...            |
| 32         | 032         | (Last Student) |

**Note:** The mock data generates 32 students total. You can scan any ID from 1-32 or roll number from 001-032.

## Troubleshooting

### Camera Not Working

**Problem:** Black screen or no camera view
**Solution:**

1. Check camera permissions in phone settings
2. Restart the app
3. Make sure no other app is using the camera

### QR Code Not Scanning

**Problem:** Scanner doesn't detect QR code
**Solution:**

1. Make sure QR code is clear and well-lit
2. Position QR code fully within the scanning frame
3. Hold phone steady for 1-2 seconds
4. Try adjusting distance (not too close, not too far)

### Student Not Found Error

**Problem:** Valid student shows "not found"
**Solution:**

1. Verify the QR code data matches student ID or roll number
2. Check if you're in the correct class
3. Make sure QR code contains only the ID (e.g., "1" not "Student 1")

### Permission Denied

**Problem:** Camera permission was denied
**Solution:**

1. Go to phone Settings
2. Find the Expo Go app (or your app)
3. Enable Camera permission
4. Restart the app

## Quick Test Checklist

- [ ] Open Attendance tab
- [ ] Tap QR icon in header
- [ ] Grant camera permission
- [ ] Scanner opens with camera view
- [ ] Scanning frame is visible
- [ ] Generate QR code with data "1"
- [ ] Scan the QR code
- [ ] Success message appears
- [ ] Student "Ahmed Ali" is shown
- [ ] Close scanner
- [ ] Verify student marked as Present
- [ ] Stats show 1 marked, 31 remaining

## Demo Video Steps

If you want to record a demo:

1. **Setup Shot:** Show the attendance screen
2. **Action:** Tap QR icon
3. **Permission:** Grant camera access
4. **Scan:** Show QR code being scanned
5. **Success:** Show success message
6. **Verify:** Show updated attendance list
7. **Stats:** Show updated statistics

## Next Steps

After testing:

1. ✅ Verify all students can be scanned
2. ✅ Test with different classes
3. ✅ Test error scenarios
4. ✅ Test in light/dark mode
5. ✅ Test on different devices

## Notes

- The scanner only works for students in the **currently selected class**
- Scanning automatically marks students as **Present** (not Late or Absent)
- There's a **2-second cooldown** between scans to prevent duplicates
- The scanner uses the **back camera** by default
- QR codes must contain **only the student ID or roll number** (no extra text)

---

**Ready to test?** Generate a few QR codes and start scanning! 📱✨
