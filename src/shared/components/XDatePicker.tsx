import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  findNodeHandle,
  Dimensions,
  StyleProp,
  TextStyle
} from 'react-native';
import Popover from 'react-native-popover-view';
import  XCalendar  from './XCalendar';
import { XTimePicker } from './XTimePicker';
import { format } from 'date-fns';
import XText from './XText';
import XInput from './XInput';
import { registerPopover, unregisterPopover } from '../utils/PopoverManager';

const { width: SW } = Dimensions.get('window');
const POPUP_H = 360;

type Mode = 'date'|'time'|'datetime';
type Props = {
  mode?: Mode;
  value?: Date;
  onChange: (d: Date) => void;
  placeholder?: string;
  style?: any;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  displayFormat?: string; // Thêm parameter displayFormat
  textAlign?: 'left' | 'center' | 'right';
  containerStyle?: StyleProp<TextStyle>
};

export function XDatePicker({
  mode='date', value, onChange, 
  placeholder='Select...', 
  label, 
  style, 
  minDate, 
  maxDate,
  displayFormat,
  textAlign,
  containerStyle
}: Props) {
  const touchableRef = useRef<any>(null);
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState(value||new Date());

  // Tạo hàm để lấy format mặc định dựa trên mode
  const getDefaultFormat = (mode: Mode) => {
    switch (mode) {
      case 'time':
        return 'hh:mm a'; // Thay đổi từ 'HH:mm' thành 'hh:mm a' để hiển thị AM/PM
      case 'date':
        return 'yyyy-MM-dd';
      case 'datetime':
        return 'yyyy-MM-dd hh:mm a'; // Thay đổi từ 'yyyy-MM-dd HH:mm' thành 'yyyy-MM-dd hh:mm a'
      default:
        return 'yyyy-MM-dd';
    }
  };

  // Sử dụng displayFormat nếu được cung cấp,否则 sử dụng format mặc định
  const formatToUse = displayFormat || getDefaultFormat(mode);

  const display = value
    ? format(value, formatToUse)
    : placeholder;

  // confirm for datetime
  const confirm = () => {
    onChange(temp);
    setShow(false);
  };

  const openPopover = useCallback(() => {
    
    registerPopover(() => setShow(false));
    unregisterPopover();
    setShow(true);
  }, []);

  React.useEffect(() => {
    if (!show) unregisterPopover();
    return () => {
      if (show) unregisterPopover();
    };
  }, [show]);

  return (
    <>
      <TouchableOpacity
        ref={touchableRef}
        onPress={openPopover}
        activeOpacity={0.7}
        style={style}
        hitSlop={{ top:13, bottom: 22, left: 0, right: 0 }} 
      >
        <XInput containerStyle={containerStyle} textAlign='center' editable={false} value={display} label={label} />
        
      </TouchableOpacity>
      
        
      {show&&
      <Popover
        isVisible={show}
        from={touchableRef}
        onRequestClose={() => setShow(false)}
        popoverStyle={styles.popover}
        
        // arrowStyle={styles.arrow}
        backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        onCloseComplete={unregisterPopover}
      
      >
        <View style={{ maxWidth: SW - 16, minWidth: 280, maxHeight: POPUP_H }}>
          {(mode==='date' || mode==='datetime') && (
            <XCalendar
              selected={temp}
              onSelect={d => {
                if(mode==='date'){
                  onChange(d);
                  setTemp(d)
                  // setShow(false);
                } else {
                  setTemp(d);
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
          {(mode==='time' || mode==='datetime') && (
            <XTimePicker
              hour={temp.getHours()}
              minute={temp.getMinutes()}
              onTimeChange={(h,m)=>{
                const d=new Date(temp);
                d.setHours(h,m);
                if(mode==='time'){
                  onChange(d);
                  setTemp(d);
                  // setShow(false);
                } else {
                  setTemp(d);
                }
              }}
            />
          )}
          {mode==='datetime' && (
            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>setShow(false)} style={styles.btn}>
                <Text>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirm} style={styles.btn}>
                <Text>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Popover>}
    </>
  );
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,borderColor:'#ccc',
    padding:8,
    borderRadius:6,
    backgroundColor:'#fff'
  },
  popover:{
    borderRadius:8,
    overflow:'hidden'
  },
  arrow:{
    borderTopColor:'#fff'
  },
  actions:{
    flexDirection:'row',
    justifyContent:'flex-end',
    padding:8
  },
  btn:{
    marginLeft:12,paddingHorizontal:16,paddingVertical:8
  }
});
