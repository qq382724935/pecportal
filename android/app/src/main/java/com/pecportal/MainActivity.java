/*
 * @Author: 刘利军
 * @Date: 2020-06-22 11:12:02
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-22 11:17:12
 * @Description: 
 */ 
package com.pecportal;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "pecportal";
  }
  // 启动屏重写onCreate
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here 
    super.onCreate(savedInstanceState);
  }
}
