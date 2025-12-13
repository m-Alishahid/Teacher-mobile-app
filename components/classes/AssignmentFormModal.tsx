import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ClassItem } from '@/types/classes';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface AssignmentFormModalProps {
  visible: boolean;
  onClose: () => void;
  selectedClass: ClassItem | null;
}

export function AssignmentFormModal({
  visible,
  onClose,
  selectedClass,
}: AssignmentFormModalProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionInstructions, setSubmissionInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [assignmentType, setAssignmentType] = useState<'homework' | 'project' | 'quiz' | 'exam'>('homework');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attachments, setAttachments] = useState<Array<{name: string, type: string, size: string}>>([]);
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [autoGrade, setAutoGrade] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubmissionInstructions('');
    setDueDate('');
    setDueTime('');
    setTotalMarks('');
    setAssignmentType('homework');
    setPriority('medium');
    setAttachments([]);
    setAllowLateSubmission(false);
    setNotifyStudents(true);
    setAutoGrade(false);
  };

  const handleAddAttachment = () => {
    Alert.alert(
      '📎 Add Attachment',
      'Choose attachment type',
      [
        {
          text: '📄 Document',
          onPress: () => {
            const newAttachment = {
              name: `Assignment_Document_${attachments.length + 1}.pdf`,
              type: 'pdf',
              size: `${Math.floor(Math.random() * 500 + 100)} KB`
            };
            setAttachments([...attachments, newAttachment]);
          },
        },
        {
          text: '🖼️ Image',
          onPress: () => {
            const newAttachment = {
              name: `Assignment_Image_${attachments.length + 1}.jpg`,
              type: 'image',
              size: `${Math.floor(Math.random() * 800 + 200)} KB`
            };
            setAttachments([...attachments, newAttachment]);
          },
        },
        {
          text: '🎥 Video',
          onPress: () => {
            const newAttachment = {
              name: `Assignment_Video_${attachments.length + 1}.mp4`,
              type: 'video',
              size: `${Math.floor(Math.random() * 5 + 2)} MB`
            };
            setAttachments([...attachments, newAttachment]);
          },
        },
        {
          text: '🔗 Link',
          onPress: () => {
            const newAttachment = {
              name: `Reference_Link_${attachments.length + 1}`,
              type: 'link',
              size: '-'
            };
            setAttachments([...attachments, newAttachment]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleDatePicker = () => {
    // In a real app, this would open a native date picker
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    Alert.alert(
      '📅 Select Due Date',
      'Choose a date or enter custom',
      [
        {
          text: 'Tomorrow',
          onPress: () => setDueDate(tomorrow.toLocaleDateString('en-GB')),
        },
        {
          text: 'Next Week',
          onPress: () => setDueDate(nextWeek.toLocaleDateString('en-GB')),
        },
        { text: 'Custom', style: 'cancel' },
      ]
    );
  };

  const handleTimePicker = () => {
    Alert.alert(
      '⏰ Select Time',
      'Choose a time',
      [
        { text: '09:00 AM', onPress: () => setDueTime('09:00 AM') },
        { text: '12:00 PM', onPress: () => setDueTime('12:00 PM') },
        { text: '03:00 PM', onPress: () => setDueTime('03:00 PM') },
        { text: '11:59 PM', onPress: () => setDueTime('11:59 PM') },
        { text: 'Custom', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('⚠️ Required Field', 'Please enter assignment title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('⚠️ Required Field', 'Please enter assignment description');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('⚠️ Required Field', 'Please enter due date');
      return;
    }
    if (!totalMarks.trim()) {
      Alert.alert('⚠️ Required Field', 'Please enter total marks');
      return;
    }

    // Success
    const successDetails = [
      `📚 Type: ${assignmentType.charAt(0).toUpperCase() + assignmentType.slice(1)}`,
      `📅 Due: ${dueDate}${dueTime ? ` at ${dueTime}` : ''}`,
      `📊 Total Marks: ${totalMarks}`,
      attachments.length > 0 ? `📎 ${attachments.length} attachment(s)` : '',
      notifyStudents ? '🔔 Students will be notified' : '',
      allowLateSubmission ? '⏰ Late submission allowed' : '',
      autoGrade ? '✨ Auto-grading enabled' : '',
    ].filter(Boolean).join('\n');

    Alert.alert(
      '✅ Assignment Created Successfully!',
      `"${title}" has been created for ${selectedClass?.className}.\n\n${successDetails}`,
      [
        {
          text: 'Create Another',
          onPress: () => {
            resetForm();
          },
        },
        {
          text: 'Done',
          style: 'cancel',
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    if (title || description || dueDate || totalMarks) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  if (!selectedClass) return null;

  const assignmentTypes = [
    { id: 'homework', label: 'Homework', icon: 'book.fill', color: colors.status.info.main },
    { id: 'project', label: 'Project', icon: 'folder.fill', color: colors.status.success.main },
    { id: 'quiz', label: 'Quiz', icon: 'doc.text.fill', color: colors.status.warning.main },
    { id: 'exam', label: 'Exam', icon: 'graduationcap.fill', color: colors.status.error.main },
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: colors.status.success.main },
    { id: 'medium', label: 'Medium', color: colors.status.warning.main },
    { id: 'high', label: 'High', color: colors.status.error.main },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}>
        <Animated.View
          style={[
            styles.formModal,
            {
              backgroundColor: colors.background.primary,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconContainer, { backgroundColor: colors.primary.contrast + '20' }]}>
                <IconSymbol name="doc.text.fill" size={28} color={colors.primary.contrast} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: colors.primary.contrast }]}>
                  Create Assignment
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary.contrast + 'CC' }]}>
                  {selectedClass.className} • {selectedClass.subject}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color={colors.primary.contrast} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Assignment Title */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                📝 Assignment Details
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  Title <Text style={{ color: colors.status.error.main }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.ui.border,
                    },
                  ]}
                  placeholder="e.g., Chapter 5 Homework"
                  placeholderTextColor={colors.text.tertiary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: colors.text.secondary }]}>
                    Description <Text style={{ color: colors.status.error.main }}>*</Text>
                  </Text>
                  <Text style={[styles.charCounter, { color: description.length > 500 ? colors.status.error.main : colors.text.tertiary }]}>
                    {description.length}/500
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: description.length > 500 ? colors.status.error.main : colors.ui.border,
                    },
                  ]}
                  placeholder="Describe the assignment, instructions, and requirements..."
                  placeholderTextColor={colors.text.tertiary}
                  value={description}
                  onChangeText={(text) => text.length <= 500 && setDescription(text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  Submission Instructions
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.ui.border,
                    },
                  ]}
                  placeholder="How should students submit? (e.g., Upload PDF, Write in notebook, etc.)"
                  placeholderTextColor={colors.text.tertiary}
                  value={submissionInstructions}
                  onChangeText={setSubmissionInstructions}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Assignment Type */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                📚 Assignment Type
              </Text>
              <View style={styles.typeGrid}>
                {assignmentTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor:
                          assignmentType === type.id
                            ? type.color + '20'
                            : colors.background.secondary,
                        borderColor:
                          assignmentType === type.id ? type.color : colors.ui.border,
                      },
                    ]}
                    onPress={() => setAssignmentType(type.id as any)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={type.icon as any}
                      size={24}
                      color={assignmentType === type.id ? type.color : colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        {
                          color:
                            assignmentType === type.id ? type.color : colors.text.primary,
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date & Time */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                📅 Due Date & Time
              </Text>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.text.secondary }]}>
                    Date <Text style={{ color: colors.status.error.main }}>*</Text>
                  </Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[
                        styles.inputFlex,
                        {
                          backgroundColor: colors.background.secondary,
                          color: colors.text.primary,
                          borderColor: colors.ui.border,
                        },
                      ]}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={colors.text.tertiary}
                      value={dueDate}
                      onChangeText={setDueDate}
                    />
                    <TouchableOpacity 
                      style={[styles.pickerButton, { backgroundColor: colors.primary.main }]}
                      onPress={handleDatePicker}
                    >
                      <IconSymbol name="calendar" size={18} color={colors.primary.contrast} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.text.secondary }]}>Time</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[
                        styles.inputFlex,
                        {
                          backgroundColor: colors.background.secondary,
                          color: colors.text.primary,
                          borderColor: colors.ui.border,
                        },
                      ]}
                      placeholder="HH:MM"
                      placeholderTextColor={colors.text.tertiary}
                      value={dueTime}
                      onChangeText={setDueTime}
                    />
                    <TouchableOpacity 
                      style={[styles.pickerButton, { backgroundColor: colors.primary.main }]}
                      onPress={handleTimePicker}
                    >
                      <IconSymbol name="clock.fill" size={18} color={colors.primary.contrast} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Marks & Priority */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                🎯 Grading & Priority
              </Text>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.text.secondary }]}>
                    Total Marks <Text style={{ color: colors.status.error.main }}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary,
                        borderColor: colors.ui.border,
                      },
                    ]}
                    placeholder="100"
                    placeholderTextColor={colors.text.tertiary}
                    value={totalMarks}
                    onChangeText={setTotalMarks}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.text.secondary }]}>Priority</Text>
                  <View style={styles.priorityButtons}>
                    {priorities.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.priorityButton,
                          {
                            backgroundColor:
                              priority === p.id ? p.color + '20' : colors.background.secondary,
                            borderColor: priority === p.id ? p.color : colors.ui.border,
                          },
                        ]}
                        onPress={() => setPriority(p.id as any)}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            { color: priority === p.id ? p.color : colors.text.secondary },
                          ]}
                        >
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Attachments */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  📎 Attachments
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary.main }]}
                  onPress={handleAddAttachment}
                >
                  <IconSymbol name="plus" size={16} color={colors.primary.contrast} />
                  <Text style={[styles.addButtonText, { color: colors.primary.contrast }]}>
                    Add File
                  </Text>
                </TouchableOpacity>
              </View>

              {attachments.length > 0 ? (
                <View style={styles.attachmentsList}>
                  {attachments.map((attachment, index) => (
                    <View
                      key={index}
                      style={[
                        styles.attachmentItem,
                        { backgroundColor: colors.background.secondary, borderColor: colors.ui.border },
                      ]}
                    >
                      <View style={[
                        styles.attachmentIconContainer,
                        { 
                          backgroundColor: 
                            attachment.type === 'pdf' ? colors.status.error.main + '20' :
                            attachment.type === 'image' ? colors.status.success.main + '20' :
                            attachment.type === 'video' ? colors.status.warning.main + '20' :
                            colors.primary.main + '20'
                        }
                      ]}>
                        <IconSymbol
                          name={
                            attachment.type === 'pdf' ? 'doc.fill' :
                            attachment.type === 'image' ? 'photo.fill' :
                            attachment.type === 'video' ? 'play.rectangle.fill' :
                            'link'
                          }
                          size={24}
                          color={
                            attachment.type === 'pdf' ? colors.status.error.main :
                            attachment.type === 'image' ? colors.status.success.main :
                            attachment.type === 'video' ? colors.status.warning.main :
                            colors.primary.main
                          }
                        />
                      </View>
                      <View style={styles.attachmentInfo}>
                        <Text style={[styles.attachmentName, { color: colors.text.primary }]}>
                          {attachment.name}
                        </Text>
                        <Text style={[styles.attachmentSize, { color: colors.text.tertiary }]}>
                          {attachment.size}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveAttachment(index)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <IconSymbol name="xmark.circle.fill" size={24} color={colors.status.error.main} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyAttachments, { backgroundColor: colors.background.secondary }]}>
                  <IconSymbol name="paperclip" size={32} color={colors.text.tertiary} />
                  <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                    No attachments added
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
                    Tap "Add File" to attach documents, images, or links
                  </Text>
                </View>
              )}
            </View>

            {/* Options */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                ⚙️ Options
              </Text>
              
              <TouchableOpacity
                style={[styles.optionRow, { backgroundColor: colors.background.secondary }]}
                onPress={() => setAllowLateSubmission(!allowLateSubmission)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <IconSymbol
                    name="clock.fill"
                    size={20}
                    color={allowLateSubmission ? colors.primary.main : colors.text.secondary}
                  />
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                      Allow Late Submission
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                      Students can submit after due date
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: allowLateSubmission
                        ? colors.primary.main
                        : colors.ui.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: colors.primary.contrast,
                        transform: [{ translateX: allowLateSubmission ? 20 : 2 }],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionRow, { backgroundColor: colors.background.secondary }]}
                onPress={() => setNotifyStudents(!notifyStudents)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <IconSymbol
                    name="bell.fill"
                    size={20}
                    color={notifyStudents ? colors.primary.main : colors.text.secondary}
                  />
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                      Notify Students
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                      Send notification to all {selectedClass.totalStudents} students
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: notifyStudents ? colors.primary.main : colors.ui.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: colors.primary.contrast,
                        transform: [{ translateX: notifyStudents ? 20 : 2 }],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionRow, { backgroundColor: colors.background.secondary }]}
                onPress={() => setAutoGrade(!autoGrade)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <IconSymbol
                    name="wand.and.stars"
                    size={20}
                    color={autoGrade ? colors.primary.main : colors.text.secondary}
                  />
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                      Auto-Grade (Beta)
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                      Automatically grade objective questions
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: autoGrade ? colors.primary.main : colors.ui.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: colors.primary.contrast,
                        transform: [{ translateX: autoGrade ? 20 : 2 }],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: Spacing['2xl'] }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.footer, { backgroundColor: colors.background.secondary, borderTopColor: colors.ui.border }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background.primary, borderColor: colors.ui.border }]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary.main }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary.contrast} />
              <Text style={[styles.submitButtonText, { color: colors.primary.contrast }]}>
                Create Assignment
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formModal: {
    height: '95%',
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContent: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSizes.base,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  typeLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  addButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  attachmentsList: {
    gap: Spacing.sm,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  attachmentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: Spacing.xs,
  },
  attachmentName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: FontSizes.xs,
  },
  emptyAttachments: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  charCounter: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSizes.base,
  },
  pickerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: FontSizes.xs,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  submitButtonText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
});
