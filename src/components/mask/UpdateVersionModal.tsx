import React, {Component} from 'react';
import Mask from './Mask';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
const {width} = Dimensions.get('window');
import {syncImmediate} from '../../utils/CodePushUtils';
import UpdateVersionProgress from './UpdateVersionProgress';
import {TouchableOpacity} from 'react-native-gesture-handler';
export interface UpdateVersionModalProps {
  display: boolean;
  dispatch: Function;
  app: any;
}

export interface UpdateVersionModalState {
  showProgress: boolean;
}

class UpdateVersionModal extends Component<
  UpdateVersionModalProps,
  UpdateVersionModalState
> {
  constructor(props: Readonly<UpdateVersionModalProps>) {
    super(props);
    this.state = {
      showProgress: false,
    };
  }
  render() {
    const {display, dispatch, app} = this.props;
    const {description, speed, isMandatory} = app.updateVersionData;
    const {showProgress} = this.state;
    if (!display) {
      return null;
    }
    return (
      <Mask display={display}>
        <View style={styles.modal}>
          <Image
            style={{
              width: width - 60,
              height: 200,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
            }}
            source={require('../../assets/update/update.jpeg')}
            resizeMode="stretch"
          />
          {!showProgress ? (
            // 更新内容
            <>
              <View style={styles.content}>
                <Text
                  style={{fontSize: 18, fontWeight: '600', paddingBottom: 8}}>
                  更新内容
                </Text>
                <Text style={{color: 'rgba(0,0,0,.45)'}}>{description}</Text>
              </View>
              <View style={styles.footer}>
                {!isMandatory && (
                  <View
                    style={{
                      borderRightColor: '#e9e9e9',
                      borderRightWidth: 1,
                      flex: 1,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch({
                          type: 'app/updateState',
                          payload: {updateVersionData: {show: false}},
                        });
                      }}>
                      <Text
                        style={{alignSelf: 'center'}}
                        onPress={() => {
                          dispatch({
                            type: 'app/updateState',
                            payload: {updateVersionData: {show: false}},
                          });
                        }}>
                        暂不更新
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({showProgress: true});
                      syncImmediate();
                    }}>
                    <Text style={{alignSelf: 'center'}}>立即更新</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            // 更新进度
            <UpdateVersionProgress display={showProgress} progress={speed} />
          )}
        </View>
      </Mask>
    );
  }
}

const mapStateToProps = ({app, router}: any) => ({app, router});
export default connect(mapStateToProps)(UpdateVersionModal);

const styles = StyleSheet.create({
  modal: {
    minWidth: width - 60,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 25,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
  },
});
