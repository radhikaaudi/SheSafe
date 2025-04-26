import {View,Text,TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Plus, Phone, Heart, Trash } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useContacts, Contact } from '../../context/ContactsContext';
import { getAuth } from 'firebase/auth';
import CustomAlert from '../../components/CustomAlert';
import { router } from 'expo-router';

export default function ContactsScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [userId, setUserId] = useState<string | null>(null);
  const { contacts, loading, error: apiError, fetchContacts, addContact, deleteContact } = useContacts();

  const [formData, setFormData] = useState<Omit<Contact, '_id'>>({
    name: '',
    phone: '',
    relation: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchContacts(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
    });
  };

  const handleAddContact = async () => {
    if (!formData.name || !formData.phone || !formData.relation) {
      showAlert('error', 'Error', 'Please fill in all fields');
      return;
    }

    if (contacts.length >= 5) {
      showAlert('error', 'Error', 'Maximum 5 contacts allowed');
      return;
    }

    if (!userId) return;

    try {
      await addContact(userId, formData);
      setFormData({ name: '', phone: '', relation: '' });
      showAlert('success', 'Success', 'Contact added successfully');
    } catch (error) {
      showAlert('error', 'Error', 'Failed to add contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!contactId || !userId) return;
    try {
      await deleteContact(userId, contactId);
      showAlert('success', 'Success', 'Contact deleted successfully');
    } catch (error) {
      showAlert('error', 'Error', 'Failed to delete contact');
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
      <View style={[styles.header, !isSmallScreen && styles.headerWide]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Contacts</Text>
      </View>

      <Text style={styles.subtitle}>
        Select minimum of 3 and maximum of 5 contacts.
      </Text>

      <ScrollView style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <View style={styles.contactForm}>
          <Text style={styles.formTitle}>Enter Contact Details</Text>

          {formError && <Text style={styles.errorText}>{formError}</Text>}
          {apiError && <Text style={styles.errorText}>{apiError}</Text>}

          {['name', 'phone', 'relation'].map((field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${field}`}
                placeholderTextColor="#666"
                value={formData[field as keyof typeof formData]}
                keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                onChangeText={(text) =>
                  setFormData({ ...formData, [field]: text })
                }
              />
            </View>
          ))}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFormData({ name: '', phone: '', relation: '' })}
            >
              <Text style={styles.cancelButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, loading && styles.disabledButton]}
              onPress={handleAddContact}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Contact</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactList}>
          {loading && contacts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : (
            <>
              {contacts.map((contact, index) => (
                <View key={contact._id || index} style={styles.contactCard}>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactHeader}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          contact._id && handleDeleteContact(contact._id)
                        }
                        style={styles.deleteButton}
                      >
                        <Trash size={16} color="#FF4444" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.contactDetails}>
                      <View style={styles.detailRow}>
                        <Phone size={16} color="#666" />
                        <Text style={styles.contactPhone}>{contact.phone}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Heart size={16} color="#666" />
                        <Text style={styles.contactRelation}>{contact.relation}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {contacts.length < 5 && (
                <View style={styles.emptySlot}>
                  <Plus size={24} color="#666" />
                  <Text style={styles.emptySlotText}>Add more contacts</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... keep your existing styles as they are
  container: {
    flex: 1,
    backgroundColor: '#4A0072',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerWide: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  contactForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  addButton: {
    flex: 1,
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#FF1493',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#FF1493AA',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  contactList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },
  contactDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactPhone: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  contactRelation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  emptySlot: {
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});