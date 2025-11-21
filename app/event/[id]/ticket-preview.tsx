import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useEvent, useTicket } from '@/contexts';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TicketPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let eventId = params.id;
  if (Array.isArray(eventId)) eventId = eventId[0];
  let ticketId = params.ticketId;
  if (Array.isArray(ticketId)) ticketId = ticketId[0];

  const { myTickets } = useTicket();
  const { events } = useEvent();

  // Find the specific ticket
  const ticket = myTickets.find(t => t.ticket_id === ticketId) || myTickets[0];
  const event = events.find(e => e.event_id === eventId);

  const ticketType = ticket?.sectionName || 'Standard';
  const amount = ticket?.price || 0;
  const holderName = ticket?.User?.name || 'Guest';

  // Use real data from backend
  const eventName = event?.title || 'Event';
  const venue = event?.Venue?.location || 'Venue TBD';
  const boughtAt = ticket?.purchaseDate ? new Date(ticket.purchaseDate).toLocaleTimeString() : 'N/A';
  const date = event?.date ? new Date(event.date).toLocaleDateString() : 'TBD';

  // Generate a unique QR code value from ticket data
  const qrValue = ticket?.qrCodeUrl || JSON.stringify({
    ticketId: ticket?.ticket_id || ticketId,
    eventId,
    holderName,
    timestamp: Date.now(),
  });

  // PDF download handler
  const handleDownloadTicket = async () => {
    try {
      const html = `
        <html>
          <body style="font-family: Arial; padding: 0; margin: 0; background: #000; color: #fff;">
            <div style="width: 100vw; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <h2 style="color: #e6007e; margin-bottom: 8px;">${eventName}</h2>
              <div style="margin-bottom: 16px;">
                <img src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}' width="180" height="180" />
              </div>
              <div style="background: #18181b; border-radius: 16px; padding: 18px 24px; width: 320px;">
                <div style="font-weight: bold; color: #e6007e; font-size: 18px; margin-bottom: 8px;">${eventName}</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">${ticketType} (1)</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">${venue}</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">Amount: ${amount} Rwf</div>
                <div style="font-size: 14px; color: #fff; margin-bottom: 2px;">Bought at: ${boughtAt}</div>
                <div style="font-size: 14px; color: #fff;">Date: ${date}</div>
              </div>
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'android') {
        // Save to Downloads using StorageAccessFramework
        const permissions = await MediaLibrary.requestPermissionsAsync();
        if (permissions.status !== 'granted') {
          Alert.alert('Permission required', 'Please grant storage permission to save the ticket.');
          return;
        }
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        Alert.alert('Ticket Saved', 'Your ticket PDF has been saved to your Downloads folder.');
      } else if (Platform.OS === 'ios') {
        const dest = `ticket_${eventId}_${Date.now()}.pdf`;
        await FileSystem.copyAsync({ from: uri, to: dest });
        await Sharing.shareAsync(dest);
      } else {
        window.open(uri, '_blank');
      }
    } catch {
      Alert.alert('Error', 'Could not generate PDF.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header showLogo showProfile showSearch />
      <View className="flex-1 items-center px-0 pt-0">
        <View className="flex-row items-center w-full mt-4 mb-6 px-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-text ml-2">Ticket Preview</Text>
        </View>
        <View className="bg-card rounded-3xl p-6 items-center w-[70%] self-center mb-10" style={styles.shadow}>
          <View className="bg-background rounded-2xl p-[9px] mb-[18px]">
            <QRCode
              value={qrValue}
              size={width * 0.55}
              color={Colors.primary}
              backgroundColor={Colors.background}
            />
          </View>
          <View className="items-start w-full self-center mt-1.5">
            <Text className="text-primary font-bold text-xl mb-1.5">{eventName}</Text>
            <Text className="text-text text-base font-medium mb-0.5">{ticketType}</Text>
            <Text className="text-text text-base font-medium mb-0.5">Holder: {holderName}</Text>
            <Text className="text-text text-[15px] mb-0.5">{venue}</Text>
            <Text className="text-text text-[15px] font-bold mb-0.5">Amount: {amount.toLocaleString()} RWF</Text>
            <Text className="text-text text-sm mb-0.5">Bought at: {boughtAt}</Text>
            <Text className="text-text text-sm">Date: {date}</Text>
          </View>
        </View>
        <View className="bg-card rounded-t-[32px] py-2.5 px-6 w-full absolute bottom-0 left-0 right-0" style={styles.shadowTop}>
          <Text className="text-text font-bold text-[17px] mb-[18px]">Quick Action</Text>
          <View className="flex-row justify-between items-start w-full">
            <TouchableOpacity className="flex-1 items-center mx-2" onPress={() => router.push(`/event/${eventId}/menu`)}>
              <View className="bg-white rounded-2xl w-12 h-12 items-center justify-center mb-2 shadow-sm">
                <MaterialCommunityIcons name="food-fork-drink" size={28} color={Colors.primary} />
              </View>
              <Text className="text-text text-[13px] text-center mt-0.5">Place foods and drinks order</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center mx-2" onPress={handleDownloadTicket}>
              <View className="bg-primary rounded-2xl w-12 h-12 items-center justify-center mb-2 shadow-sm">
                <Feather name="download" size={28} color="#fff" />
              </View>
              <Text className="text-text text-[13px] text-center mt-0.5">Download Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shadowTop: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
});
