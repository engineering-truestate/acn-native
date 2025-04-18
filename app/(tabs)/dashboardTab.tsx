import { collection, doc, getDocs, query, updateDoc, where, onSnapshot, QueryDocumentSnapshot, DocumentData, getCountFromServer, documentId } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';
import { Property, Requirement, Enquiry, EnquiryWithProperty } from '../types';
import Dashboard from '../components/dashboard/Dashboard';
import { RootState } from '@/store/store';
interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  handlePropertyStatusChange: (value: string, propertyId: string) => Promise<void>;
}

interface UseEnquiriesResult {
  myEnquiries: EnquiryWithProperty[];
  loading: boolean;
  error: string | null;
}

const useCpId = (): string | undefined => {
  const reduxCpId: string | undefined = useSelector((state: RootState) => state.agent?.docData?.cpId);
  return reduxCpId;
  // return "CPA537";
  // return "INT002"
};

const getUnixDateTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

const useEnquiries = (): UseEnquiriesResult => {
  const [myEnquiries, setMyEnquiries] = useState<EnquiryWithProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();

  useEffect(() => {
    if (!cpId) {
      setError('No channel partner ID found. Please login again.');
      return;
    }

    setLoading(true);
    
    try {
      // Create the query the same way as before
      const enquiriesQuery = query(collection(db, 'enquiries'), where("cpId", "==", cpId));
      
      // Set up real-time listener for enquiries
      const unsubscribe = onSnapshot(enquiriesQuery, async (snapshot) => {
        const enquiriesData: Enquiry[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        console.log(enquiriesData);
        
        // Now fetch property details for each of myEnquiries - keeping your original logic
        const propertyIds = [...new Set(enquiriesData.map(enquiry => enquiry.propertyId))];
        let propertyDocs: Map<string, DocumentData> = new Map();

        for (let i = 0; i < propertyIds.length; i += 30) {
          const batch = propertyIds.slice(i, i + 30);
          const properties = await getDocs(query(collection(db, 'ACN123'), where(documentId(), "in", batch)));
          properties.docs.map((item) => {
            propertyDocs.set(item.id, item.data());
          });
        }

        const enquiriesWithProperty = enquiriesData.map((enquiry) => {
          if (enquiry.propertyId && propertyDocs.has(enquiry.propertyId)) {
            return {
              ...enquiry,
              property: {
                ...propertyDocs.get(enquiry.propertyId)
              } as Property,
            };
          }
          // Return the enquiry without property if propertyId doesn't exist or fetch fails
          return {
            ...enquiry,
            property: null,
          };
        });
        
        setMyEnquiries(enquiriesWithProperty);
        setLoading(false);
      }, (err) => {
        setError(err.message || 'Error fetching enquiries');
        console.error('Fetch error:', err);
        setLoading(false);
      });
      
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
      
    } catch (err: any) {
      setError(err.message || 'Error fetching enquiries');
      console.error('Fetch error:', err);
      setLoading(false);
    }
  }, [cpId]);

  return { myEnquiries, loading, error };
};

const useProperties = (): UsePropertiesResult => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();

  useEffect(() => {
    if (!cpId) {
      setError('No channel partner ID found. Please login again.');
      return;
    }

    setLoading(true);
    
    try {
      // Create query the same way as before
      const q = query(collection(db, 'ACN123'), where('cpCode', '==', cpId));
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const propertiesData: Property[] = querySnapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
        } as Property));

        console.log(propertiesData);
        setProperties(propertiesData);
        setLoading(false);
      }, (err) => {
        setError(err.message || 'Error fetching properties');
        console.error('Fetch error:', err);
        setLoading(false);
      });
      
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
      
    } catch (err: any) {
      setError(err.message || 'Error fetching properties');
      console.error('Fetch error:', err);
      setLoading(false);
    }
  }, [cpId]);

  const handlePropertyStatusChange = async (value: string, propertyId: string): Promise<void> => {
    try {
      const newStatus = value;

      // Update local state
      setProperties((prev) =>
        prev.map((property) =>
          property.propertyId === propertyId ? { ...property, status: newStatus } : property
        )
      );
    } catch (err) {
      console.error('Error updating property status:', err);
      setError('Failed to update property status. Please try again.');
    }
  };

  return { properties, loading, error, handlePropertyStatusChange };
};

const useRequirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cpId = useCpId();

  useEffect(() => {
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
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requirementsData: Requirement[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        } as Requirement));

        console.log(requirementsData);
        setRequirements(requirementsData);
        setLoading(false);
      }, (err) => {
        setError(err.message || 'Error fetching requirements');
        console.error('Fetch error:', err);
        setLoading(false);
      });
      
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
      
    } catch (err: any) {
      setError(err.message || 'Error fetching requirements');
      console.error('Fetch error:', err);
      setLoading(false);
    }
  }, [cpId]);

  const hanldeRequirementsStatusChange = async (value: string, requirementsId: string): Promise<void> => {
    try {
      const newStatus = value;

      // Update local state
      setRequirements((prev) =>
        prev.map((requirements) =>
          requirements.requirementId === requirementsId ? { ...requirements, status: newStatus } : requirements
        )
      );
    } catch (err) {
      console.error('Error updating enquiry status:', err);
      setError('Failed to update enquiry status. Please try again.');
    }
  };

  return { requirements, loading, error, hanldeRequirementsStatusChange };
};

export default function DashboardTab() {
  const { myEnquiries, loading: enquiriesLoading, error: enquiriesError } = useEnquiries();
  const { properties, loading: propertiesLoading, error: propertiesError, handlePropertyStatusChange } = useProperties();
  const { requirements, loading: requirementsLoading, error: requirementsError, hanldeRequirementsStatusChange: hanldeRequirementsStatusChange } = useRequirements();

  return (
    <View style={{ flex: 1 }}>
      <Dashboard
        myEnquiries={myEnquiries}
        myProperties={properties}
        myRequirements={requirements}
        propertyStatusUpdate={handlePropertyStatusChange}
        hanldeRequirementsStatusChange={hanldeRequirementsStatusChange}
        loading={{ enquiriesLoading: enquiriesLoading, propertiesLoading: propertiesLoading, requirementsLoading: requirementsLoading }}
      />
    </View>
  );
}