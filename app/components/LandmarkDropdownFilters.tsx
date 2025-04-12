import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';

// API key - in a real app, this should be stored securely and not hardcoded
const API_KEY = 'AIzaSyBsygl4y777lWd7M7mMQMwvnTyYFjPwoaM'; // Replace with your actual API key

// Define the type for our landmark
interface Landmark {
    name: string;
    lat: number;
    lng: number;
    radius: number;
}

// Define types for API responses
interface PlacePrediction {
    place_id: string;
    description: string;
}

interface PlaceDetails {
    name: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    }
}

interface LandmarkDropdownFiltersProps {
    selectedLandmark: Landmark | null;
    setSelectedLandmark: (landmark: Landmark | null) => void;
}

// Real API call to Google Places Autocomplete
const searchLocations = async (query: string): Promise<PlacePrediction[]> => {
    if (!query.trim()) return [];

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK') {
            return data.predictions.map((prediction: any) => ({
                place_id: prediction.place_id,
                description: prediction.description
            }));
        } else {
            console.error('Places API error:', data.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        return [];
    }
};

// Real API call to Google Place Details
const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.result) {
            return {
                name: data.result.name,
                geometry: {
                    location: {
                        lat: data.result.geometry.location.lat,
                        lng: data.result.geometry.location.lng
                    }
                }
            };
        } else {
            console.error('Place Details API error:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
};

const LandmarkDropdownFilters = ({ selectedLandmark, setSelectedLandmark }: LandmarkDropdownFiltersProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PlacePrediction[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sliderValue, setSliderValue] = useState(selectedLandmark?.radius || 5000); // Default 5km radius
    const [sliderTempValue, setSliderTempValue] = useState(selectedLandmark?.radius || 5000); // Temporary value during sliding

    // Update search query when selectedLandmark changes
    useEffect(() => {
        if (selectedLandmark) {
            setSearchQuery(selectedLandmark.name);
            setSliderValue(selectedLandmark.radius);
            setSliderTempValue(selectedLandmark.radius);
        }
    }, [selectedLandmark]);

    // Search for locations when query changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                setIsLoading(true);
                searchLocations(searchQuery)
                    .then(results => {
                        setSearchResults(results);
                        setShowResults(true);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error('Error searching locations:', err);
                        setIsLoading(false);
                    });
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle selecting a place from search results
    const handleSelectPlace = async (placeId: string, description: string) => {
        try {
            setIsLoading(true);
            const details = await getPlaceDetails(placeId);
            if (details && details.geometry) {
                const location: Landmark = {
                    name: details.name || description,
                    lat: details.geometry.location.lat,
                    lng: details.geometry.location.lng,
                    radius: sliderValue, // Use the current slider value
                };
                setSelectedLandmark(location);
                setSearchQuery(description);
                setShowResults(false);
                console.log("landmark", location);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error getting place details:", error);
            setIsLoading(false);
        }
    };

    // Handle slider change - track temp value during sliding
    const handleSliderChange = useCallback((value: number) => {
        setSliderTempValue(value);
    }, []);

    // Update the actual value when sliding is complete
    const handleSlidingComplete = useCallback((value: number) => {
        setSliderValue(value);
        if (selectedLandmark) {
            setSelectedLandmark({
                ...selectedLandmark,
                radius: value,
            });
        }
    }, [selectedLandmark, setSelectedLandmark]);

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedLandmark(null);
        setSearchResults([]);
        setShowResults(false);
        setSliderValue(5000); // Reset slider to default
        setSliderTempValue(5000); // Also reset temp value
    };

    // Format radius display properly
    const formatRadius = (meters: number) => {
        return (meters / 1000).toFixed(1);
    };

    return (
        <View style={styles.container}>
            {/* Custom Search Input */}
            <View style={styles.inputContainer}>
                {/* Uncomment when you have the actual icons */}
                {/* <Image 
          source={require('./assets/icons/location.png')} 
          style={styles.icon} 
        /> */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Search landmarks"
                    placeholderTextColor="#7A7B7C"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => {
                        if (searchQuery.trim() && searchResults.length > 0) {
                            setShowResults(true);
                        }
                    }}
                />
                {isLoading ? (
                    <ActivityIndicator style={styles.loadingIndicator} size="small" color="#666" />
                ) : searchQuery ? (
                    <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 ? (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.place_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.resultItem}
                                onPress={() => handleSelectPlace(item.place_id, item.description)}
                            >
                                <Text style={styles.resultText}>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            ) : null}

            {/* Slider section that shows only when a landmark is selected */}
            {selectedLandmark ? (
                <View style={styles.sliderContainer}>
                    <View style={styles.radiusHeaderContainer}>
                        <Text style={styles.radiusHeader}>Search Radius (in km)</Text>
                        {/* Uncomment when you have the actual icons */}
                        {/* <Image 
              source={require('./assets/icons/info.png')} 
              style={styles.infoIcon} 
            /> */}
                    </View>

                    <View style={styles.radiusLabelsContainer}>
                        <Text style={styles.radiusLabel}>1 km</Text>
                        <Text style={styles.radiusLabel}>{formatRadius(sliderTempValue)} km</Text>
                        <Text style={styles.radiusLabel}>10 km</Text>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={1000}
                        maximumValue={10000}
                        step={100}
                        value={sliderValue}
                        onValueChange={handleSliderChange}
                        onSlidingComplete={handleSlidingComplete}
                        minimumTrackTintColor="#333333"
                        maximumTrackTintColor="#DDDDDD"
                        thumbTintColor="#FFFFFF"
                    />
                </View>
            ) : null}
        </View>
    );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 1,
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 12,
        top: 10,
        zIndex: 1,
    },
    textInput: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#7A7B7C',
        paddingLeft: 40, // Space for the icon
        paddingRight: 40, // Space for clear button or loading indicator
        height: 40,
        borderWidth: 1.5,
        borderColor: '#E3E3E3',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 14,
        color: '#999',
        fontWeight: 'bold',
    },
    loadingIndicator: {
        position: 'absolute',
        right: 10,
    },
    resultsContainer: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        maxHeight: 150,
        zIndex: 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    resultText: {
        fontSize: 12,
        color: '#333',
    },
    sliderContainer: {
        marginTop: 16,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    radiusHeaderContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 6,
    },
    radiusHeader: {
        fontFamily: 'System',
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        marginRight: 10,
    },
    infoIcon: {
        width: 16,
        height: 16,
    },
    radiusLabelsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    radiusLabel: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#7A7B7C',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default LandmarkDropdownFilters;