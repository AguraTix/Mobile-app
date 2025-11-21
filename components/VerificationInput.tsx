import Colors from '@/constants/Colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

interface VerificationInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({ length = 5, onCodeFilled }) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if code is complete
    const filledCode = newCode.join('');
    if (filledCode.length === length) {
      onCodeFilled(filledCode);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between w-full my-5">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            className="w-[50px] h-[50px] rounded-lg bg-input-background text-text text-xl text-center font-bold"
            maxLength={1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectionColor={Colors.primary}
          />
        ))}
    </View>
  );
};

export default VerificationInput;
