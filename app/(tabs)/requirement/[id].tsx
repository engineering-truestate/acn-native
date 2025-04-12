// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../config/firebase';

// interface Requirement {
//   requirementId: string;
//   title: string;
//   location: string;
//   assetType: string;
//   configuration: string;
//   budget: number;
//   timeline: string;
//   status: string;
//   createdAt: string;
//   description: string;
// }

// const RequirementDetailPage = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [requirement, setRequirement] = useState<Requirement | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequirement = async () => {
//       try {
//         const requirementsRef = collection(db, 'requirements');
//         const q = query(requirementsRef, where('requirementId', '==', id));
//         const querySnapshot = await getDocs(q);
        
//         if (!querySnapshot.empty) {
//           const doc = querySnapshot.docs[0];
//           setRequirement(doc.data() as Requirement);
//         }
//       } catch (error) {
//         console.error('Error fetching requirement:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequirement();
//   }, [id]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#10B981" />
//       </View>
//     );
//   }

//   if (!requirement) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Requirement not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons name="arrow-back" size={24} color="#1F2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Requirement Details</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Basic Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Basic Information</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Title</Text>
//             <Text style={styles.value}>{requirement.title}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Location</Text>
//             <Text style={styles.value}>{requirement.location}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Asset Type</Text>
//             <Text style={styles.value}>{requirement.assetType}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Configuration</Text>
//             <Text style={styles.value}>{requirement.configuration}</Text>
//           </View>
//         </View>

//         {/* Budget & Timeline */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Budget & Timeline</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Budget</Text>
//             <Text style={styles.value}>₹{requirement.budget.toLocaleString()}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Timeline</Text>
//             <Text style={styles.value}>{requirement.timeline}</Text>
//           </View>
//         </View>

//         {/* Additional Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Additional Details</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Status</Text>
//             <View style={[
//               styles.statusBadge,
//               { backgroundColor: requirement.status === 'Active' ? '#ECFDF5' : '#FEF3F2' }
//             ]}>
//               <Text style={[
//                 styles.statusText,
//                 { color: requirement.status === 'Active' ? '#10B981' : '#EF4444' }
//               ]}>
//                 {requirement.status}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Created On</Text>
//             <Text style={styles.value}>{new Date(requirement.createdAt).toLocaleDateString()}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Description</Text>
//             <Text style={styles.value}>{requirement.description}</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.contactButton}>
//           <Text style={styles.contactButtonText}>Contact Client</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F6F7',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   value: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1F2937',
//     flex: 1,
//     textAlign: 'right',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   contactButton: {
//     backgroundColor: '#10B981',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   contactButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default RequirementDetailPage; 

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

// interface Requirement {
//   requirementId: string;
//   title: string;
//   location: string;
//   assetType: string;
//   configuration: string;
//   budget: number;
//   timeline: string;
//   status: string;
//   createdAt: string;
//   description: string;
// }

// const RequirementDetailPage = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [requirement, setRequirement] = useState<Requirement | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequirement = async () => {
//       try {
//         const requirementsRef = collection(db, 'requirements');
//         const q = query(requirementsRef, where('requirementId', '==', id));
//         const querySnapshot = await getDocs(q);
        
//         if (!querySnapshot.empty) {
//           const doc = querySnapshot.docs[0];
//           setRequirement(doc.data() as Requirement);
//         }
//       } catch (error) {
//         console.error('Error fetching requirement:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequirement();
//   }, [id]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#10B981" />
//       </View>
//     );
//   }

//   if (!requirement) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Requirement not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons name="arrow-back" size={24} color="#1F2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Requirement Details</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Basic Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Basic Information</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Title</Text>
//             <Text style={styles.value}>{requirement.title}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Location</Text>
//             <Text style={styles.value}>{requirement.location}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Asset Type</Text>
//             <Text style={styles.value}>{requirement.assetType}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Configuration</Text>
//             <Text style={styles.value}>{requirement.configuration}</Text>
//           </View>
//         </View>

//         {/* Budget & Timeline */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Budget & Timeline</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Budget</Text>
//             <Text style={styles.value}>₹{requirement.budget.toLocaleString()}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Timeline</Text>
//             <Text style={styles.value}>{requirement.timeline}</Text>
//           </View>
//         </View>

//         {/* Additional Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Additional Details</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Status</Text>
//             <View style={[
//               styles.statusBadge,
//               { backgroundColor: requirement.status === 'Active' ? '#ECFDF5' : '#FEF3F2' }
//             ]}>
//               <Text style={[
//                 styles.statusText,
//                 { color: requirement.status === 'Active' ? '#10B981' : '#EF4444' }
//               ]}>
//                 {requirement.status}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Created On</Text>
//             <Text style={styles.value}>{new Date(requirement.createdAt).toLocaleDateString()}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Description</Text>
//             <Text style={styles.value}>{requirement.description}</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.contactButton}>
//           <Text style={styles.contactButtonText}>Contact Client</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F6F7',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   value: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1F2937',
//     flex: 1,
//     textAlign: 'right',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   contactButton: {
//     backgroundColor: '#10B981',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   contactButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default RequirementDetailPage; 