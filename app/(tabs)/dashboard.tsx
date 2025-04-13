import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';

interface Property {
  id: string;
  status: string;
  address?: string;
  [key: string]: any; // For any additional dynamic fields in the property
}

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  handlePropertyStatusChange: (value: string, propertyId: string) => Promise<void>;
}

interface Enquiry {
  id: string;
  cpId?: string;
  propertyId?: string;
  status?: string;
  message?: string;
  createdAt?: number;
  [key: string]: any; // for additional dynamic fields
}

interface UseEnquiriesResult {
  enquiries: Enquiry[];
  myEnquiries: Enquiry[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  agent?: {
    docData?: {
      cpId?: string;
    };
  };
}

const useCpId = (): string | null => {
  const [cpId, setCpId] = useState<string | null>(null);

  const reduxCpId = useSelector((state: RootState) => state.agent?.docData?.cpId);

  useEffect(() => {
    // In React Native, we usually don't get query params from URL like in web
    // If you're deep linking, you'd need to extract cpId from the navigation params
    // For now, we fallback to reduxCpId
    setCpId(reduxCpId || null);
  }, [reduxCpId]);

  return "CPA537";
};

const getUnixDateTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

const useEnquiries = (): UseEnquiriesResult => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [myEnquiries, setMyEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();
  console.log('cpId:', cpId);

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!cpId) {
        setError('No channel partner ID found. Please login again.');
        return;
      }

      setLoading(true);
      try {
        // Using where clause to filter on the server side instead of client side
        const q = query(collection(db, 'enquiries'), where('cpId', '==', cpId));
        const querySnapshot = await getDocs(q);

        const enquiriesData: Enquiry[] = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setEnquiries(enquiriesData);
        setMyEnquiries(enquiriesData);
      } catch (err: any) {
        setError(err.message || 'Error fetching enquiries');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [cpId]);

  return { enquiries, myEnquiries, loading, error };
};

const useProperties = (): UsePropertiesResult => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!cpId) {
        setError('No channel partner ID found. Please login again.');
        return;
      }

      setLoading(true);
      try {
        // Using the original collection name 'ACN123' as it might be specific to your application
        const q = query(collection(db, 'ACN123'), where('cpCode', '==', cpId));
        const querySnapshot = await getDocs(q);

        const propertiesData: Property[] = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          status: docSnap.data().status || 'unknown', // Provide a default value for status
          ...docSnap.data(),
        }));

        setProperties(propertiesData);
      } catch (err: any) {
        setError(err.message || 'Error fetching properties');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [cpId]);

  const handlePropertyStatusChange = async (value: string, propertyId: string): Promise<void> => {
    try {
      const newStatus = value;
      const timestamp = getUnixDateTime();

      await updateDoc(doc(db, 'ACN123', propertyId), {
        status: newStatus,
        ageOfStatus: 0,
        dateOfStatusLastChecked: timestamp,
      });

      // Update local state
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, status: newStatus } : property
        )
      );
    } catch (err) {
      console.error('Error updating property status:', err);
      setError('Failed to update property status. Please try again.');
    }
  };

  return { properties, loading, error, handlePropertyStatusChange };
};

const PropertyDetailsModal: React.FC<{
  isVisible: boolean;
  property: Property | null;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
}> = ({ isVisible, property, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    if (property) {
      setNewStatus(property.status);
    }
  }, [property]);

  if (!property) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Property Details</Text>
          
          <Text style={styles.propertyDetail}>ID: {property.id}</Text>
          <Text style={styles.propertyDetail}>Status: {property.status}</Text>
          {property.address && (
            <Text style={styles.propertyDetail}>Address: {property.address}</Text>
          )}
          {/* Display other property details here */}
          
          <View style={styles.statusContainer}>
            <Text style={styles.label}>Update Status:</Text>
            <View style={styles.statusOptions}>
              {['available', 'sold', 'pending', 'off-market'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    newStatus === status && styles.selectedStatus,
                  ]}
                  onPress={() => setNewStatus(status)}
                >
                  <Text style={styles.statusText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={() => {
                onUpdateStatus(newStatus);
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EnquiryDetailsModal: React.FC<{
  isVisible: boolean;
  enquiry: Enquiry | null;
  onClose: () => void;
}> = ({ isVisible, enquiry, onClose }) => {
  if (!enquiry) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enquiry Details</Text>
          
          <Text style={styles.propertyDetail}>Enquiry ID: {enquiry.id}</Text>
          {enquiry.propertyId && (
            <Text style={styles.propertyDetail}>Property ID: {enquiry.propertyId}</Text>
          )}
          {enquiry.status && (
            <Text style={styles.propertyDetail}>Status: {enquiry.status}</Text>
          )}
          {enquiry.message && (
            <Text style={styles.propertyDetail}>Message: {enquiry.message}</Text>
          )}
          {enquiry.createdAt && (
            <Text style={styles.propertyDetail}>
              Date: {new Date(enquiry.createdAt * 1000).toLocaleString()}
            </Text>
          )}
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'requirements' |  'enquiries'>('properties');
  const [isMobile, setIsMobile] = useState<boolean>(Dimensions.get('window').width <= 768);
  
  const { properties, loading: propertiesLoading, error: propertiesError, handlePropertyStatusChange } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDetailsModalOpen, setPropertyDetailsModalOpen] = useState<boolean>(false);

  const { myEnquiries, loading: enquiriesLoading, error: enquiriesError } = useEnquiries();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState<boolean>(false);

  console.log('Properties:', properties);
  console.log('My Enquiries:', myEnquiries.length);

  useEffect(() => {
    const handleDimensionChange = ({ window }: { window: { width: number; height: number } }) => {
      setIsMobile(window.width <= 768);
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const renderError = (error: string | null) => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );

  const renderProperties = () => {
    if (propertiesLoading) return renderLoading();
    if (propertiesError) return renderError(propertiesError);
    
    return (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>My Properties ({properties.length})</Text>
        {properties.length === 0 ? (
          <Text style={styles.emptyMessage}>No properties found.</Text>
        ) : (
          properties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.listItem}
              onPress={() => {
                setSelectedProperty(property);
                setPropertyDetailsModalOpen(true);
              }}
            >
              <Text style={styles.itemTitle}>{property.address || 'Property ' + property.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(property.status) }]}>
                <Text style={styles.statusBadgeText}>{property.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  const renderEnquiries = () => {
    if (enquiriesLoading) return renderLoading();
    if (enquiriesError) return renderError(enquiriesError);

    return (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>My Enquiries ({myEnquiries.length})</Text>
        {myEnquiries.length === 0 ? (
          <Text style={styles.emptyMessage}>No enquiries found.</Text>
        ) : (
          myEnquiries.map((enquiry) => (
            <TouchableOpacity
              key={enquiry.id}
              style={styles.listItem}
              onPress={() => {
                setSelectedEnquiry(enquiry);
                setEnquiryModalOpen(true);
              }}
            >
              <Text style={styles.itemTitle}>
                Enquiry {enquiry.id.substring(0, 8)}...
              </Text>
              {enquiry.status && (
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(enquiry.status) }]}>
                  <Text style={styles.statusBadgeText}>{enquiry.status}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agent Dashboard</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
          onPress={() => setActiveTab('properties')}
        >
          <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
            Properties
          </Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={[styles.tab, activeTab === 'requirements' && styles.activeTab]}
          onPress={() => setActiveTab('requirements')}
        >
          <Text style={[styles.tabText, activeTab === 'requirements' && styles.activeTabText]}>
            Requirements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'enquiries' && styles.activeTab]}
          onPress={() => setActiveTab('enquiries')}
        >
          <Text style={[styles.tabText, activeTab === 'enquiries' && styles.activeTabText]}>
            Enquiries
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'properties' ? renderProperties() : renderEnquiries()}
      
      <PropertyDetailsModal
        isVisible={isPropertyDetailsModalOpen}
        property={selectedProperty}
        onClose={() => setPropertyDetailsModalOpen(false)}
        onUpdateStatus={(status) => {
          if (selectedProperty) {
            handlePropertyStatusChange(status, selectedProperty.id);
          }
        }}
      />
      
      <EnquiryDetailsModal
        isVisible={isEnquiryModalOpen}
        enquiry={selectedEnquiry}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </ScrollView>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'available':
      return '#4CAF50'; // Green
    case 'sold':
      return '#F44336'; // Red
    case 'pending':
      return '#FF9800'; // Orange
    case 'off-market':
      return '#9E9E9E'; // Gray
    default:
      return '#2196F3'; // Blue
  }
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    fontWeight: '500',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMessage: {
    padding: 20,
    textAlign: 'center',
    color: '#757575',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  propertyDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusContainer: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  statusOption: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedStatus: {
    backgroundColor: '#007BFF',
  },
  statusText: {
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Dashboard;