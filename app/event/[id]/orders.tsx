import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useOrder } from '@/contexts';
import { FoodOrder } from '@/types/backend';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventOrdersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('orders');
  const { myOrders, fetchOrdersByEvent, isLoading } = useOrder();
  const [orders, setOrders] = useState<FoodOrder[]>([]);

  useEffect(() => {
    if (id) {
      fetchOrdersByEvent(id)
        .then(setOrders)
        .catch((error) => {
          console.error('Failed to fetch orders:', error);
          // Fallback to myOrders if event-specific fetch fails
          setOrders(myOrders);
        });
    } else {
      setOrders(myOrders);
    }
  }, [id, myOrders]);

  const handleOrderAgain = (order: FoodOrder) => {
    // Navigate back to menu or reorder
    router.push(`/event/${id}/menu`);
  };

  // Order Item Component
  const OrderItem = ({ order }: { order: FoodOrder }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderImageContainer}>
        <Image
          source={require('@/assets/images/m1.png')}
          style={styles.orderImage}
        />
      </View>
      <View style={styles.orderContent}>
        <Text style={styles.orderName}>Food Order</Text>
        <Text style={styles.orderDescription}>
          {order.special_instructions || 'No special instructions'}
        </Text>
        <Text style={styles.orderPrice}>
          Qty: {order.quantity}
        </Text>
      </View>
      <View style={styles.orderActions}>
        <Text style={styles.orderQuantity}>{order.quantity}</Text>
        <TouchableOpacity
          style={styles.orderAgainButton}
          onPress={() => handleOrderAgain(order)}
        >
          <Text style={styles.orderAgainText}>Order again</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>✓</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => { }}
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Event Orders</Text>
          <TouchableOpacity>
            <Text style={styles.recentText}>Recent</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'menu' && styles.tabActive]}
            onPress={() => {
              setSelectedTab('menu');
              router.push(`/event/${id}/menu`);
            }}
          >
            <Text style={[styles.tabText, selectedTab === 'menu' && styles.tabTextActive]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.tabActive]}
            onPress={() => setSelectedTab('orders')}
          >
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.tabTextActive]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <ScrollView
          style={styles.ordersList}
          contentContainerStyle={styles.ordersListContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No orders yet</Text>
            </View>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.order_id} order={order} />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  orderImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderContent: {
    flex: 1,
  },
  orderName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  orderPrice: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  orderQuantity: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderAgainButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  orderAgainText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
});
