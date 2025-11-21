import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock menu items
const mockMenuItems = [
  { id: '1', name: 'Burger', category: 'food', price: 5000, available: true },
  { id: '2', name: 'Pizza', category: 'food', price: 8000, available: true },
  { id: '3', name: 'Coke', category: 'drinks', price: 2000, available: true },
];

export default function EventMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('menu');
  const currentMenuItems = mockMenuItems;

  const handleOrderItem = (item: any) => {
    if (!item.available) return;
    router.push(`/event/${id}/food-detail?itemId=${item.id}`);
  };

  const handleSwitchToOrders = () => {
    setSelectedTab('orders');
    router.push(`/event/${id}/orders`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍔';
      case 'drinks': return '🥤';
      case 'snacks': return '🍿';
      default: return '🍽️';
    }
  };

  const groupedItems = currentMenuItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Event Menu</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'menu' && styles.activeTab]}
            onPress={() => setSelectedTab('menu')}
          >
            <Text style={[styles.tabText, selectedTab === 'menu' && styles.activeTabText]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.activeTab]}
            onPress={handleSwitchToOrders}
          >
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.activeTabText]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentMenuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No menu items available</Text>
              <Text style={styles.emptySubText}>Check back later!</Text>
            </View>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
                  <Text style={styles.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.itemsGrid}>
                  {(items as any[]).map((item: any) => (
                    <MenuItemComponent key={item.id} item={item} onPress={() => handleOrderItem(item)} />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Menu Item Component
const MenuItemComponent: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, !item.available && styles.menuItemDisabled]}
    onPress={onPress}
    disabled={!item.available}
    activeOpacity={0.8}
  >
    <Image 
      source={require('@/assets/images/m1.png')} 
      style={styles.menuItemImage} 
    />
    <View style={styles.menuItemContent}>
      <Text style={styles.menuItemName}>{item.name}</Text>
      <Text style={styles.menuItemPrice}>
        {item.price.toLocaleString()} RWF
      </Text>
      <View style={styles.menuItemFooter}>
        <View style={[
          styles.orderButton, 
          !item.available && styles.orderButtonDisabled
        ]}>
          <Text style={[
            styles.orderButtonText,
            !item.available && styles.orderButtonTextDisabled
          ]}>
            {item.available ? 'Order' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </View>
    {!item.available && <View style={styles.outOfStockOverlay} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.text,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
    position: 'relative',
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemImage: {
    width: '100%',
    height: 120,
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  menuItemPrice: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  orderButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  orderButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  orderButtonTextDisabled: {
    color: Colors.background,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});