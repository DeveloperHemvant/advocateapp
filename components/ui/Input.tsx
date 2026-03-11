import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  rightIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const { colors, spacing, radius } = useTheme();
  const [secure, setSecure] = useState(!!secureTextEntry);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.lg,
            paddingLeft: leftIcon ? 44 : spacing.lg,
            paddingRight: isPassword || rightIcon ? 44 : spacing.lg,
          },
        ]}
      >
        {leftIcon ? (
          <View style={styles.iconLeft}>
            <MaterialIcons name={leftIcon} size={22} color={colors.textMuted} />
          </View>
        ) : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.text,
              paddingVertical: spacing.md + 2,
            },
            style,
          ]}
          secureTextEntry={isPassword ? secure : false}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setSecure((s) => !s)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons
              name={secure ? 'visibility' : 'visibility-off'}
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>
            <MaterialIcons name={rightIcon} size={22} color={colors.textMuted} />
          </View>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  input: { flex: 1, fontSize: 16 },
  iconLeft: { position: 'absolute', left: 12, zIndex: 1 },
  iconRight: { position: 'absolute', right: 12, zIndex: 1 },
  error: { fontSize: 12, marginTop: 4, marginLeft: 4 },
});
