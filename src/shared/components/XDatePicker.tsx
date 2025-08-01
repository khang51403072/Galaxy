import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  findNodeHandle,
  Dimensions
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
};

export function XDatePicker({
  mode='date', value, onChange, placeholder='Chọn...', label, style, minDate, maxDate
}: Props) {
  const touchableRef = useRef<any>(null);
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState(value||new Date());

  const display = value
    ? mode==='time'
      ? format(value,'HH:mm')
      : mode==='date'
      ? format(value,'yyyy-MM-dd')
      : format(value,'yyyy-MM-dd HH:mm')
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
        <XInput editable={false} value={display} label={label} />
        
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
                  setShow(false);
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
                  setShow(false);
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
