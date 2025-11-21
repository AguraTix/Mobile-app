import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PaymentMethod = 'mobile_money' | 'card';

export default function PaymentScreen() {
  const router = useRouter();
  const { id, count, seats, categoryId, categoryName, price } = useLocalSearchParams<{
    id?: string;
    count?: string;
    seats?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();

  const availableMethods: PaymentMethod[] = ['mobile_money', 'card'];

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const ticketCount = Math.max(1, parseInt(count || "1", 10));
  const ticketPrice = parseFloat(price || "0");
  const totalAmount = ticketCount * ticketPrice;
  const tax = totalAmount * 0.18; // 18% tax
  const finalTotal = totalAmount + tax;

  const handlePayment = async () => {
    try {
      // Mock payment - just navigate to success
      Alert.alert("Success", "Payment processed successfully!");
      router.push(`/event/${id}/payment-success`);
    } catch (error: any) {
      Alert.alert("Payment Error", "Payment failed. Please try again.");
    }
  };

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'mobile_money':
        return (
          <View style={styles.methodContainer}>
            <Text style={styles.methodTitle}>Mobile Money Payment</Text>
            <Text style={styles.methodDescription}>
              Enter your phone number to receive a payment prompt
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 0781234567"
                placeholderTextColor={Colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.providerContainer}>
              <Text style={styles.providerLabel}>Select Provider:</Text>
              <View style={styles.providerButtons}>
                {['mtn', 'airtel', 'mpesa'].map((provider) => (
                  <TouchableOpacity
                    key={provider}
                    style={[styles.providerButton, { backgroundColor: Colors.primary }]}
                  >
                    <Text style={styles.providerButtonText}>{provider.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'card':
        return (
          <View style={styles.methodContainer}>
            <Text style={styles.methodTitle}>Card Payment</Text>
            <Text style={styles.methodDescription}>
              Enter your card details to complete the payment
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.textSecondary}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Month</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  placeholderTextColor={Colors.textSecondary}
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YY"
                  placeholderTextColor={Colors.textSecondary}
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={Colors.textSecondary}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Card Holder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.textSecondary}
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
                {saveCard && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Save card for future payments</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderPaymentSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Payment Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tickets ({ticketCount}x)</Text>
        <Text style={styles.summaryValue}>{ticketPrice.toLocaleString()} RWF</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{totalAmount.toLocaleString()} RWF</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (18%)</Text>
        <Text style={styles.summaryValue}>{tax.toLocaleString()} RWF</Text>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{finalTotal.toLocaleString()} RWF</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Payment Summary */}
          {renderPaymentSummary()}

          {/* Payment Methods */}
          <View style={styles.methodsContainer}>
            <Text style={styles.methodsTitle}>Select Payment Method</Text>
            
            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[styles.methodButton, selectedMethod === 'mobile_money' && styles.methodButtonActive]}
                onPress={() => setSelectedMethod('mobile_money')}
              >
                <Ionicons name="phone-portrait" size={24} color={selectedMethod === 'mobile_money' ? '#FFFFFF' : Colors.primary} />
                <Text style={[styles.methodButtonText, selectedMethod === 'mobile_money' && styles.methodButtonTextActive]}>
                  Mobile Money
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodButton, selectedMethod === 'card' && styles.methodButtonActive]}
                onPress={() => setSelectedMethod('card')}
              >
                <Ionicons name="card" size={24} color={selectedMethod === 'card' ? '#FFFFFF' : Colors.primary} />
                <Text style={[styles.methodButtonText, selectedMethod === 'card' && styles.methodButtonTextActive]}>
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method Form */}
          {renderPaymentMethod()}
        </ScrollView>

        {/* Payment Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>
              Pay {finalTotal.toLocaleString()} RWF
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 16,
  },
  
  // Payment Summary Styles
  summaryContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Payment Methods Styles
  methodsContainer: {
    marginBottom: 24,
  },
  methodsTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  methodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },

  // Payment Method Form Styles
  methodContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  methodTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  methodDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  providerContainer: {
    marginTop: 16,
  },
  providerLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  providerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  providerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: Colors.text,
    fontSize: 14,
  },
  paypalInfo: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
  },
  paypalText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  // Error Styles
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },

  // Bottom Button Styles
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});