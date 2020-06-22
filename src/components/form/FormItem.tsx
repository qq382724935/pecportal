import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

interface FormItemProps {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (text: string) => void | undefined;
}
const FormItem = ({label, placeholder, type, onChange}: FormItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        blurOnSubmit={true}
        style={styles.edit}
        placeholder={placeholder}
        secureTextEntry={type === 'password'}
        keyboardType="ascii-capable"
        selectTextOnFocus={false}
        onChangeText={onChange}
        placeholderTextColor="#ddd"
      />
    </View>
  );
};

export default FormItem;

const styles = StyleSheet.create({
  item: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 17,
    width: 85,
    paddingVertical: 2,
  },
  edit: {
    flex: 1,
    fontSize: 17,
    minHeight: 44,
    borderBottomColor: '#ddd',
    color: 'black',
  },
});
