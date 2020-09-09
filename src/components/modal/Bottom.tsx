import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  modalBKColor,
  defaultBKColor,
  TEXT_COLOR,
  DangerText,
  FS16,
  FS14,
  BorderColor,
} from '../../utils/styles/common';

interface ContentListProps {
  text: string;
  press: () => void;
}
export interface BottomProps {
  title?: string;
  text?: string;
  modalVisible: boolean;
  contentList?: Array<ContentListProps>;
  contrim?: () => void;
  cancel?: () => void;
  modalHide?: () => void;
}

const Bottom = ({
  title,
  text,
  modalVisible,
  contentList,
  modalHide,
  contrim,
  cancel,
}: BottomProps) => {
  const handleClose = () => {
    if (cancel) {
      cancel();
    }
  };
  const handleContrim = () => {
    if (contrim) {
      contrim();
    }
  };
  const handleModelHide = () => {
    if (modalHide) {
      modalHide();
    }
  };
  const contentRender = (data: ContentListProps[] = []) => {
    let list: ContentListProps[] = [];
    if (data.length > 0) {
      list = [...data];
    } else {
      // 默认显示确认
      list.push({
        text: text || '确认',
        press: () => {
          handleContrim();
        },
      });
    }
    return (
      <>
        {list.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={item.press}>
              <View style={[styles.content]}>
                <Text style={[styles.text, {color: DangerText}]}>
                  {item.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };
  return (
    <Modal
      isVisible={modalVisible}
      backdropOpacity={0.2}
      onBackButtonPress={handleClose}
      style={styles.container}
      onModalHide={handleModelHide}
      onBackdropPress={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.box]}>
          <View style={[styles.content, styles.padding]}>
            <Text style={[styles.text, {fontSize: FS14, color: TEXT_COLOR}]}>
              {title || '确认框'}
            </Text>
          </View>
          {contentRender(contentList)}
          <TouchableOpacity onPress={handleClose}>
            <View style={[styles.cancel, styles.padding]}>
              <Text style={[styles.text]}>取消</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default Bottom;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  box: {
    borderRadius: 10,
    backgroundColor: modalBKColor,
  },
  padding: {paddingLeft: 20, paddingRight: 20},
  content: {
    borderBottomWidth: 1,
    borderBottomColor: BorderColor,
  },
  cancel: {
    borderTopWidth: 8,
    borderTopColor: defaultBKColor,
  },
  text: {
    alignSelf: 'center',
    fontSize: FS16,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
