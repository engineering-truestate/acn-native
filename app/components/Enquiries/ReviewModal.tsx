import React, { useState } from 'react';
import { Modal, Pressable, TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ReviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({ rating: false, review: false });

  const handleSubmit = () => {
    let hasError = false;
    const newErrors = { rating: false, review: false };

    if (rating === 0) {
      newErrors.rating = true;
      hasError = true;
    }

    if (review.trim() === '') {
      newErrors.review = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    console.log('Rating:', rating);
    console.log('Review:', review);

    onClose();
    setRating(0);
    setReview('');
    setErrors({ rating: false, review: false }); // Reset errors on success
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center p-5" onPress={onClose}>
        <Pressable
          className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.heading}>Overall Rating</Text>
          <View className="flex-row justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => {
                setRating(star);
                setErrors(prev => ({ ...prev, rating: false }));
              }}>
                <FontAwesome
                  name="star"
                  size={39}
                  color={star <= rating ? '#FFD700' : '#D1D5DB'}
                  style={{ marginHorizontal: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {errors.rating && (
            <Text style={styles.errorText}>Please select a rating.</Text>
          )}

          <TextInput
            placeholder="Write your review here..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={review}
            onChangeText={(text) => {
              setReview(text);
              setErrors(prev => ({ ...prev, review: false }));
            }}
            style={styles.textInput}
          />
          {errors.review && (
            <Text style={styles.errorText}>Please enter your review.</Text>
          )}

          <TouchableOpacity
            className="bg-[#153E3B] px-4 py-3 rounded-lg w-full"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-medium text-xl">Submit Review</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    height: 128,
    fontSize: 20,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  heading: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#153E3B',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ReviewModal;
