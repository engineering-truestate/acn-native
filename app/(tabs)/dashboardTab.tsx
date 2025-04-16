import { collection, doc, getDocs, query, updateDoc, where, getDoc, QueryDocumentSnapshot, DocumentData, getCountFromServer, documentId } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';
import { Property, Requirement, Enquiry, EnquiryWithProperty } from '../types';
import Dashboard from '../components/dashboard/Dashboard';
import { RootState } from '@/store/store';

console.log("dashboardTab",);


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
  console.log('cpId:', cpId);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        // Fetch all enquiries without filtering
        const enquiriesQuery = query(collection(db, 'enquiries'),where("cpId", "==", cpId));
        const enquiriesSnapshot = await getDocs(enquiriesQuery);
        
        const enquiriesData: Enquiry[] = enquiriesSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        
        // Filter for myEnquiries if cpId exists
        if (!cpId) {
          setError('No channel partner ID found. Please login again.');
          setLoading(false);
          return;
        }

        // Filter myEnquiries with cpId
        
        // Now fetch property details for each of myEnquiries
        const propertyIds = [...new Set(enquiriesData.map(enquiry=>enquiry.propertyId))];
        let propertyDocs:Map<string, DocumentData> = new Map();
        
        for(let i=0; i<propertyIds.length; i+=30){
            const batch = propertyIds.slice(i,i+30);
            // console.log("batch",batch);
            const properties = await getDocs(query(collection(db, 'ACN123'), where(documentId(),"in", batch)));
            // console.log("properties",properties.docs);
            properties.docs.map((item)=>{
              propertyDocs.set(item.id,item.data());
            })
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
      } catch (err: any) {
        setError(err.message || 'Error fetching enquiries');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
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
          ...docSnap.data(),
        } as Property
      ));

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
        const requirementsData: Requirement[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        } as Requirement));

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

export default function DashboardTab() {
  const { myEnquiries, loading: enquiriesLoading, error: enquiriesError } = useEnquiries();
  const { properties, loading: propertiesLoading, error: propertiesError, handlePropertyStatusChange } = useProperties();
  const { requirements, loading: requirementsLoading, error: requirementsError } = useRequirements();

  return( 
    <Dashboard  myEnquiries={myEnquiries} myProperties={properties} myRequirements={requirements} />
  );
} 