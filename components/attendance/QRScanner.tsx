/**
 * QR Scanner Component for Attendance
 * 
 * Features:
 * - Scans student QR codes
 * - Auto-marks attendance for current class
 * - Shows scanned student details
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | null;
}

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (studentId: string) => void;
  currentClassStudents: Student[];
}

export default function QRScanner({ visible, onClose, onScan, currentClassStudents }: QRScannerProps) {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastScannedStudent, setLastScannedStudent] = useState<Student | null>(null);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    // Console log the raw QR scan response
    console.log('=== QR CODE SCANNED ===');
    console.log('Raw QR Data:', data);
    console.log('Scan Time:', new Date().toLocaleTimeString());

    setScanned(true);

    // Find student in current class by ID or roll number
    const student = currentClassStudents.find(
      s => s.id === data || s.rollNumber === data
    );

    if (student) {
      // Console log found student details
      console.log('✅ Student Found:');
      console.log('  - ID:', student.id);
      console.log('  - Name:', student.name);
      console.log('  - Roll Number:', student.rollNumber);
      console.log('  - Current Status:', student.status);
      console.log('======================');

      setLastScannedStudent(student);
      onScan(student.id);
      
      // Reset after 2 seconds to allow next scan
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    } else {
      // Console log when student not found
      console.log('❌ Student NOT Found');
      console.log('  - Scanned Data:', data);
      console.log('  - Total Students in Class:', currentClassStudents.length);
      console.log('======================');

      Alert.alert(
        '❌ Student Not Found',
        'This student is not enrolled in the current class.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  const handleClose = () => {
    setScanned(false);
    setLastScannedStudent(null);
    onClose();
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
          <View style={styles.permissionContainer}>
            <IconSymbol name="camera.fill" size={64} color={colors.text.secondary} />
            <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
              Camera Permission Required
            </Text>
            <Text style={[styles.permissionText, { color: colors.text.secondary }]}>
              We need camera access to scan student QR codes for attendance.
            </Text>
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: colors.primary.main }]}
              onPress={requestPermission}
            >
              <Text style={[styles.permissionButtonText, { color: colors.primary.contrast }]}>
                Grant Permission
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.ui.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="xmark" size={24} color={colors.primary.contrast} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary.contrast }]}>
            Scan Student QR Code
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            {/* Scanning Frame */}
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary.main }]} />
                <View style={[styles.corner, styles.topRight, { borderColor: colors.primary.main }]} />
                <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary.main }]} />
                <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary.main }]} />
              </View>
            </View>

            {/* Scan Status */}
            {scanned && lastScannedStudent && (
              <View style={[styles.scanResult, { backgroundColor: colors.status.success.main }]}>
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary.contrast} />
                <View style={styles.scanResultText}>
                  <Text style={[styles.scanResultName, { color: colors.primary.contrast }]}>
                    {lastScannedStudent.name}
                  </Text>
                  <Text style={[styles.scanResultRoll, { color: colors.primary.contrast }]}>
                    Roll No: {lastScannedStudent.rollNumber}
                  </Text>
                </View>
              </View>
            )}
          </CameraView>
        </View>

        {/* Instructions */}
        <View style={[styles.instructions, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.instructionsTitle, { color: colors.text.primary }]}>
            How to Scan
          </Text>
          <Text style={[styles.instructionsText, { color: colors.text.secondary }]}>
            1. Ask student to show their QR code{'\n'}
            2. Position the QR code within the frame{'\n'}
            3. Attendance will be marked automatically
          </Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Total Students
              </Text>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {currentClassStudents.length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Marked
              </Text>
              <Text style={[styles.statValue, { color: colors.status.success.main }]}>
                {currentClassStudents.filter(s => s.status !== null).length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Remaining
              </Text>
              <Text style={[styles.statValue, { color: colors.status.warning.main }]}>
                {currentClassStudents.filter(s => s.status === null).length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },

  // Camera
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },

  // Scanner Overlay
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: BorderRadius.lg,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: BorderRadius.lg,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: BorderRadius.lg,
  },

  // Scan Result
  scanResult: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  scanResultText: {
    flex: 1,
  },
  scanResultName: {
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  scanResultRoll: {
    fontSize: FontSizes.sm,
    opacity: 0.9,
  },

  // Instructions
  instructions: {
    padding: Spacing.lg,
  },
  instructionsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  instructionsText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },

  // Stats
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },

  // Permission
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  permissionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    minWidth: 200,
  },
  permissionButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    minWidth: 200,
  },
  cancelButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    textAlign: 'center',
  },
});
