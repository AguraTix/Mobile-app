import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import Images from '@/constants/images';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleSignUp = () => {
        router.push('/auth/register');
    };

    return (
        <View className="bg-black flex-1 items-center justify-center">
            <StatusBar style="light" />
            <View className="flex-1 w-full px-8 pt-8 z-10 justify-center">
                <View
                    className="w-full rounded-[30px] overflow-hidden mb-8 bg-transparent items-center"
                    style={{ height: height * 0.36 }}
                >
                    <Carousel>
                        <Image
                            source={{ uri: Images.concertImage1 }}
                            className="w-full h-full rounded-[30px]"
                            contentFit="cover"
                        />
                        <Image
                            source={{ uri: Images.concertImage2 }}
                            className="w-full h-full rounded-[30px]"
                            contentFit="cover"
                        />
                    </Carousel>
                    {/* Progress dot indicator is handled inside Carousel component now, or was it? 
                        Wait, previous code had a progressDot View OUTSIDE Carousel but inside carouselContainer.
                        Carousel component ALSO has pagination dots.
                        The previous code had:
                        <Carousel>...</Carousel>
                        <View style={styles.progressDot} />
                        
                        And Carousel component has:
                        <View style={styles.pagination}>...</View>
                        
                        So there might be double dots or the outer one was a custom one?
                        The outer one was just a single dot?
                        "progressDot" style: width 8, height 8, borderRadius 4, backgroundColor white, marginTop 16.
                        
                        If Carousel has its own pagination, maybe I don't need the outer one?
                        I'll keep it if it was there, but it looks like a static dot?
                        Actually, let's check Carousel.tsx again. It renders children in ScrollView and then a pagination view below it.
                        So the outer `progressDot` in `welcome.tsx` might be redundant or a mistake in previous code, or a specific design element.
                        I will remove it if Carousel handles pagination, to be cleaner, or keep it if I want exact parity.
                        Given Carousel has pagination, I'll assume the outer one was extra or for a different purpose (maybe a single static dot?).
                        I'll leave it out for now as Carousel has dots.
                    */}
                </View>

                <View className="flex-1 items-center justify-center w-full">
                    <Text className="text-[26px] font-bold text-white text-center leading-[34px] mb-5">
                        Enjoy Endless Events{"\n"}Experiences with <Text className="text-white font-bold underline decoration-[#e6007e] decoration-solid">Agura</Text>
                    </Text>
                    <Text className="text-[15px] text-white text-center leading-[22px] mb-8 opacity-90">
                        Agura Ticketing platform is here for your events grab your tickets have fun in one platform
                    </Text>

                    <View className="flex-row justify-center w-full mt-2">
                        <View className="flex-1 mr-2 min-w-[100px] max-w-[140px]">
                            <Button
                                title="Login"
                                variant="primary"
                                onPress={handleLogin}
                                rounded
                                style={{ paddingVertical: 10, paddingHorizontal: 0 }}
                            />
                        </View>
                        <View className="flex-1 ml-2 min-w-[100px] max-w-[140px]">
                            <Button
                                title="Sign Up"
                                variant="outline"
                                onPress={handleSignUp}
                                rounded
                                style={{ paddingVertical: 10, paddingHorizontal: 0, backgroundColor: '#fff' }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
