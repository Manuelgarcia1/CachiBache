import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ReportHeader() {
  return (
    <View>
      <LinearGradient
        colors={['#1e40af', '#5eb0ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="white" />
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});