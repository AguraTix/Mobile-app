import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

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
            <View className="flex-1 w-full px-8 pt-8 z-10 justify-center">
                <View
                    className="w-full rounded-[30px] overflow-hidden mb-8 bg-transparent"
                    style={{ height: height * 0.46 }}
                >
                    <Carousel >
                        <View className="flex-1 w-full">
                            <Image
                                source={require('@/assets/images/m1.png')}
                                className="w-full h-full rounded-[30px]"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 w-full">
                            <Image
                                source={require('@/assets/images/m2.png')}
                                className="w-full h-full rounded-[30px]"
                                resizeMode="cover"
                            />
                        </View>
                    </Carousel>
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
