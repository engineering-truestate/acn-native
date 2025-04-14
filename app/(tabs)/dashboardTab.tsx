import { collection, doc, getDocs, query, updateDoc, where, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';
import { Property } from '../types';
import Dashboard from '../components/dashboard/Dashboard';


interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  handlePropertyStatusChange: (value: string, propertyId: string) => Promise<void>;
}

interface EnquiryWithProperty extends Enquiry {
  property?: Property | null;
}

interface Enquiry {
  id: string;
  added?: number;
  cpId?: string;
  enquiryId?: string;
  lastModified?: number;
  propertyId?: string;
  status?: string;
  [key: string]: any; // for additional dynamic fields
}

interface UseEnquiriesResult {
  myEnquiries: EnquiryWithProperty[];
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

interface Budget{
  from?: string;
  to?: string;
}

interface Requirement {
  id: string;
  added: number;
  agentCpid: string;
  area?: number;
  assetType?: string;
  budget: Budget;
  configuration?: string;
  lastModified: number;
  marketValue?: string;
  propertyName: string, 
  requirementDetails?: string;
  requirementId: string;
  [key: string]: any;
}

const useCpId = (): string | null => {
  // const [cpId, setCpId] = useState<string | null>(null);

  const reduxCpId = useSelector((state: RootState) => state.agent?.docData?.cpId);

  // useEffect(() => {
  //   // In React Native, we usually don't get query params from URL like in web
  //   // If you're deep linking, you'd need to extract cpId from the navigation params
  //   // For now, we fallback to reduxCpId
  //   setCpId(reduxCpId || null);
  // }, [reduxCpId]);

  // return reduxCpId;
  //Test cpId
  return "CPA537";
};

const getUnixDateTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

const useEnquiries = (): UseEnquiriesResult => {
  const [myEnquiries, setMyEnquiries] = useState<EnquiryWithProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();
  console.log('cpId:', cpId);

  useEffect(() => {
    const fetchEnquiriesWithProperties = async () => {
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

        // Now fetch property details for each enquiry
        const enquiriesWithPropertyPromises = enquiriesData.map(async (enquiry) => {
          if (enquiry.propertyId) {
            try {
              const propertyDoc = await getDoc(doc(db, 'ACN123', enquiry.propertyId));
              
              if (propertyDoc.exists()) {
                return {
                  ...enquiry,
                  property: {
                    id: propertyDoc.id,
                    ...propertyDoc.data(),
                  } as Property,
                };
              }
            } catch (propertyErr) {
              console.error(`Error fetching property for enquiry ${enquiry.id}:`, propertyErr);
            }
          }
          
          // Return the enquiry without property if propertyId doesn't exist or fetch fails
          return {
            ...enquiry,
            property: null,
          };
        });

        const enquiriesWithProperties = await Promise.all(enquiriesWithPropertyPromises);
        setMyEnquiries(enquiriesWithProperties);
      } catch (err: any) {
        setError(err.message || 'Error fetching enquiries');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiriesWithProperties();
  }, [cpId]);

  return { myEnquiries, loading, error };
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

// New hook for requirements
const useRequirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!cpId) {
        setError('No channel partner ID found. Please login again.');
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, "requirements"),
          where("agentCpid", "==", cpId)
        );

        const querySnapshot = await getDocs(q);
        const requirementsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Requirement[];

        setRequirements(requirementsData);
      } catch (err: any) {
        setError(err.message || 'Error fetching requirements');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [cpId]);

  return { requirements, loading, error };
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
  enquiry: EnquiryWithProperty | null;
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
          
          {/* Display property details if available */}
          {enquiry.property && (
            <View style={styles.propertySection}>
              <Text style={styles.sectionTitle}>Property Details</Text>
              <Text style={styles.propertyDetail}>Status: {enquiry.property.status}</Text>
              {enquiry.property.address && (
                <Text style={styles.propertyDetail}>Address: {enquiry.property.address}</Text>
              )}
              {/* Add other property details you want to display */}
            </View>
          )}
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// New Modal for Requirement Details
const RequirementDetailsModal: React.FC<{
  isVisible: boolean;
  requirement: Requirement | null;
  onClose: () => void;
}> = ({ isVisible, requirement, onClose }) => {
  if (!requirement) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Requirement Details</Text>
          
          <Text style={styles.propertyDetail}>Requirement ID: {requirement.id}</Text>
          {requirement.title && (
            <Text style={styles.propertyDetail}>Title: {requirement.title}</Text>
          )}
          {requirement.description && (
            <Text style={styles.propertyDetail}>Description: {requirement.description}</Text>
          )}
          {requirement.budget && (
            <Text style={styles.propertyDetail}>Budget: {requirement.budget.from}</Text>
          )}
          {requirement.location && (
            <Text style={styles.propertyDetail}>Location: {requirement.location}</Text>
          )}
          {requirement.status && (
            <Text style={styles.propertyDetail}>Status: {requirement.status}</Text>
          )}
          {requirement.createdAt && (
            <Text style={styles.propertyDetail}>
              Date: {new Date(requirement.createdAt * 1000).toLocaleString()}
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

export default function DashboardTab() {
  const { myEnquiries, loading: enquiriesLoading, error: enquiriesError } = useEnquiries();
  // Render Dashboard directly instead of redirecting
  return( 
    <Dashboard  myEnquiries={myEnquiries}/>
  );
} 


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
  propertySection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

// export default Dashboard;