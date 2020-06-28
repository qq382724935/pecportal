/*
 * @Author: 刘利军
 * @Date: 2020-06-14 11:48:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-24 22:34:27
 * @Description:
 */
import React, {useEffect, Component} from 'react';
import {SafeAreaView, View, Text, Switch} from 'react-native';
import {resetHome} from '../utils/navigation';
import {loadToken, saveToken} from '../utils/storage/index';
import {STORAGE_KEY} from '../utils/keys';
import {Form} from '../components/index';

const Advert = ({navigation}: any) => {
  useEffect(() => {
    loadToken({key: 'config'})
      .then((advertising) => {
        const cleanTime = setTimeout(() => {
          loadToken({key: STORAGE_KEY.LOGIN})
            .then(() => {
              resetHome({navigation, name: 'main'});
            })
            .catch(() => {
              resetHome({navigation, name: 'login'});
            });
        }, advertising.showTime);
        return () => {
          cleanTime;
        };
      })
      .catch(() => {
        resetHome({navigation, name: 'login'});
      });
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Text>广告页</Text>
      </View>
    </SafeAreaView>
  );
};
class AdvertConfig extends Component<any> {
  state = {show: false, showTime: '1000', advertising: {}};
  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({headerShown: true, title: '广告配置'});
    loadToken({key: 'config'}).then((advertising) => {
      this.setState({
        show: advertising.show,
        showTime: advertising.showTime.toString(),
        advertising,
      });
    });
  }

  render() {
    const {show, showTime, advertising} = this.state;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>显示广告：</Text>
          <Switch
            value={show}
            onValueChange={(value) => {
              saveToken({key: 'config', data: {...advertising, show: value}});
              this.setState({show: value});
            }}
          />
          {show ? <Text>是</Text> : <Text>否</Text>}
        </View>
        <View>
          <Form.Item
            label="广告时长："
            defaultValue={showTime}
            placeholder="例：1000 = 1s"
            onChange={(value: number) => {
              saveToken({
                key: 'config',
                data: {...advertising, showTime: Number(value)},
              });
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const Advertising = (props: any) => {
  if (props.route.params && props.route.params.type) {
    return <AdvertConfig {...props} />;
  }
  return <Advert {...props} />;
};
export default Advertising;
