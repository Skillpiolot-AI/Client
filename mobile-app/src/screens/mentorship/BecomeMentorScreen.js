import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { id: 1, title: 'Profile details', icon: 'person' },
  { id: 2, title: 'Professional info', icon: 'briefcase' },
  { id: 3, title: 'Pricing & Focus', icon: 'cash' },
];

export default function BecomeMentorScreen({ navigation }) {
  const { theme } = useTheme();
  const { user, token } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState(''); // comma separated
  const [pricingType, setPricingType] = useState('free');
  const [sessionPrice, setSessionPrice] = useState('');

  const handleNext = () => {
    if (currentStep === 1) {
      if (!handle || !displayName || !jobTitle) return Alert.alert('Missing Info', 'Please fill required profile details');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!category || !bio) return Alert.alert('Missing Info', 'Please add a bio and category');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      submitApplication();
    }
  };

  const submitApplication = async () => {
    if (pricingType === 'paid' && !sessionPrice) {
      return Alert.alert('Missing Info', 'Please enter a session price');
    }

    setSubmitting(true);
    try {
      const payload = {
        handle: handle.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        displayName,
        jobTitle,
        company,
        bio,
        expertise: category.split(',').map(s => s.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        pricingType,
        pricing: {
          monthlyPrice: pricingType === 'free' ? 0 : Number(sessionPrice)
        }
      };

      await axios.post(`${API_BASE_URL}/api/mentor/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert(
        'Application Submitted! 🎉',
        'Your mentor application is under review. You will be notified once approved.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Step Components --- //

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>Let's set up your profile</Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>This is how mentees will see you.</Text>

      <Text style={[styles.label, { color: theme.text }]}>Mentor Handle *</Text>
      <View style={[styles.inputGroup, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={{ color: theme.textSecondary, marginRight: 8 }}>topmate.io/</Text>
        <TextInput
          style={[styles.input, { color: theme.text, flex: 1 }]}
          placeholder="your-name"
          placeholderTextColor={theme.textTertiary}
          value={handle}
          onChangeText={setHandle}
          autoCapitalize="none"
        />
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Display Name *</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="Jane Doe"
        placeholderTextColor={theme.textTertiary}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text style={[styles.label, { color: theme.text }]}>Job Title *</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="Senior Software Engineer"
        placeholderTextColor={theme.textTertiary}
        value={jobTitle}
        onChangeText={setJobTitle}
      />

      <Text style={[styles.label, { color: theme.text }]}>Company</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="Google, Stripe, etc."
        placeholderTextColor={theme.textTertiary}
        value={company}
        onChangeText={setCompany}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>Your professional background</Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>Help mentees understand your expertise.</Text>

      <Text style={[styles.label, { color: theme.text }]}>Category / Domains *</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="e.g. Engineering, Design, Product"
        placeholderTextColor={theme.textTertiary}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={[styles.label, { color: theme.text }]}>Technical Skills</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="React, Node.js, Python (comma separated)"
        placeholderTextColor={theme.textTertiary}
        value={skills}
        onChangeText={setSkills}
      />

      <Text style={[styles.label, { color: theme.text }]}>About Me (Bio) *</Text>
      <TextInput
        style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        placeholder="Share your journey and how you can help..."
        placeholderTextColor={theme.textTertiary}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>Pricing Setup</Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>How would you like to charge for your time?</Text>

      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[
            styles.radioBox,
            { borderColor: pricingType === 'free' ? theme.primary : theme.border, backgroundColor: pricingType === 'free' ? theme.primary + '10' : theme.surface }
          ]}
          onClick={() => setPricingType('free')}
          onPress={() => setPricingType('free')}
        >
          <Ionicons name={pricingType === 'free' ? 'radio-button-on' : 'radio-button-off'} size={20} color={pricingType === 'free' ? theme.primary : theme.textSecondary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.radioTitle, { color: theme.text }]}>Volunteer / Free</Text>
            <Text style={[styles.radioDesc, { color: theme.textSecondary }]}>Offer free mentorship sessions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.radioBox,
            { borderColor: pricingType === 'paid' ? theme.primary : theme.border, backgroundColor: pricingType === 'paid' ? theme.primary + '10' : theme.surface }
          ]}
          onClick={() => setPricingType('paid')}
          onPress={() => setPricingType('paid')}
        >
          <Ionicons name={pricingType === 'paid' ? 'radio-button-on' : 'radio-button-off'} size={20} color={pricingType === 'paid' ? theme.primary : theme.textSecondary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.radioTitle, { color: theme.text }]}>Paid Mentorship</Text>
            <Text style={[styles.radioDesc, { color: theme.textSecondary }]}>Charge for your time and expertise</Text>
          </View>
        </TouchableOpacity>
      </View>

      {pricingType === 'paid' && (
        <View style={{ marginTop: 24 }}>
          <Text style={[styles.label, { color: theme.text }]}>Base Session Price (₹)</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface, fontSize: 18, fontWeight: 'bold' }]}
            placeholder="e.g. 500"
            placeholderTextColor={theme.textTertiary}
            value={sessionPrice}
            onChangeText={setSessionPrice}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={[styles.infoBox, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
        <Ionicons name="information-circle" size={20} color="#4F46E5" />
        <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, color: '#4338CA', lineHeight: 18 }}>
          After approval, you can set up advanced services like mock interviews, priority DMs, and specific time slots from your Mentor Dashboard.
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => { currentStep > 1 ? setCurrentStep(currentStep - 1) : navigation.goBack() }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Become a Mentor</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, idx) => (
          <View key={step.id} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              { backgroundColor: currentStep >= step.id ? theme.primary : theme.border }
            ]}>
              <Ionicons name={step.icon} size={14} color="#fff" />
            </View>
            <Text style={[
              styles.progressText,
              { color: currentStep >= step.id ? theme.primary : theme.textSecondary, fontWeight: currentStep >= step.id ? '600' : '400' }
            ]}>
              {step.title}
            </Text>
            {idx < STEPS.length - 1 && (
              <View style={[styles.progressLine, { backgroundColor: currentStep > step.id ? theme.primary : theme.border }]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={handleNext} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>{currentStep === STEPS.length ? 'Submit Application' : 'Continue'}</Text>
              {currentStep < STEPS.length && <Ionicons name="arrow-forward" size={18} color="#fff" />}
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'center',
  },
  progressLine: {
    position: 'absolute',
    top: 15,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    height: 120,
  },
  radioGroup: {
    marginTop: 8,
    gap: 12,
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 16,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  radioDesc: {
    fontSize: 13,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
