import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface RequirementCardProps {
  requirement: {
    requirementId: string;
    title: string;
    location: string;
    assetType: string;
    configuration: string;
    budget: number;
    status: string;
    createdAt: string;
  };
}

const RequirementCard: React.FC<RequirementCardProps> = ({ requirement }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/requirement/[id]',
      params: { id: requirement.requirementId }
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>{requirement.title}</Text>
        <Text style={styles.location}>{requirement.location}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Asset Type:</Text>
          <Text style={styles.value}>{requirement.assetType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Configuration:</Text>
          <Text style={styles.value}>{requirement.configuration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Budget:</Text>
          <Text style={styles.value}>₹{requirement.budget.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{requirement.status}</Text>
        </View>
        <Text style={styles.date}>{requirement.createdAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default RequirementCard; 