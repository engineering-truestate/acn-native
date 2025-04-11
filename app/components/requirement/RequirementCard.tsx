import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHits } from 'react-instantsearch';
import { BaseHit } from 'instantsearch.js';

interface Requirement extends BaseHit {
  objectID: string;
  title: string;
  budget: number;
  assetType: string;
  configuration: string;
  location: string;
  status: string;
  createdAt: string;
}

interface RequirementCardProps {
  onPress: (requirement: Requirement) => void;
}

const RequirementCard = ({ onPress }: RequirementCardProps) => {
  const { hits } = useHits<Requirement>();



  return (
    <ScrollView style={styles.container}>
      {hits.map((requirement) => (
        <TouchableOpacity
          key={requirement.objectID}
          style={styles.card}
          onPress={() => onPress(requirement)}
        >
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="home" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{requirement.assetType}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="grid" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{requirement.configuration}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{requirement.location}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: requirement.status === 'Active' ? '#ECFDF5' : '#FEF3F2' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: requirement.status === 'Active' ? '#10B981' : '#EF4444' }
              ]}>
                {requirement.status}
              </Text>
            </View>
            <Text style={styles.date}>
              Created on {new Date(requirement.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  budget: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#10B981',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6B7280',
  },
});

export default RequirementCard; 