// // src/shared/components/XDatePicker.tsx
// import React, { useState, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   UIManager,
//   findNodeHandle,
//   LayoutChangeEvent,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import XCalendar from './XCalendar';
// import { useTheme } from '../theme';
// import XTimeWheel from './XTimeWheel';

// const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
// const MARGIN = 12;
// const DATE_W = 300;
// const DATE_H = 320;
// const TIME_W = 200;
// const TIME_H = 240;

// // ─── Utility functions ─────────────────────────────────────────────────

// function formatDateToString(d: Date): string {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// function formatTime12h(d: Date): string {
//   let h = d.getHours();
//   const m = String(d.getMinutes()).padStart(2, '0');
//   const ampm = h >= 12 ? 'PM' : 'AM';
//   h = h % 12 || 12;
//   return `${h}:${m} ${ampm}`;
// }

// // ─── TimePickerPopup (simplest wheel picker stub) ────────────────────────

// type TPProps = {
//   hour: number;
//   minute: number;
//   ampm: 'AM' | 'PM';
//   onChange: (h: number, m: number, ap: 'AM' | 'PM') => void;
//   onClose: () => void;
// };

// function TimePickerPopup({ hour, minute, ampm, onChange, onClose }: TPProps) {
//   // Đây chỉ là stub. Bạn có thể thay bằng WheelPicker thật sự.
//   return (
//     <View style={styles.timeContainer}>
//       <Text>Giờ: {hour}</Text>
//       <Text>Phút: {minute}</Text>
//       <Text>AM/PM: {ampm}</Text>
//       <View style={styles.timeBtns}>
//         <TouchableOpacity onPress={onClose} style={styles.btn}>
//           <Text>Huỷ</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => onChange(hour, minute, ampm)}
//           style={styles.btn}
//         >
//           <Text>Xác nhận</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // ─── XDatePicker Component ───────────────────────────────────────────────

// type Props = {
//   value?: Date;
//   onChange: (d: Date) => void;
//   placeholder?: string;
//   mode?: 'date' | 'time' | 'datetime';
//   style?: any;
// };

// export default function XDatePicker({
//   value = new Date(),
//   onChange,
//   placeholder = 'Chọn ngày',
//   mode = 'date',
//   style,
// }: Props) {
//   const ref = useRef<View>(null);
//   const [visible, setVisible] = useState(false);
//   const [pos, setPos] = useState({ left: MARGIN, top: MARGIN });
//   const [tempDate, setTempDate] = useState(value || new Date());
//   const theme = useTheme()
//   const updatePosition = useCallback(() => {
//     if (!ref.current) return;
//     const node = findNodeHandle(ref.current)!;
//     UIManager.measureInWindow(node, (x, y, w, h) => {
//       const W = mode === 'time' ? TIME_W : DATE_W;
//       const H = mode === 'time' ? TIME_H : DATE_H;
//       let left = x + w / 2 - W / 2;
//       let top = y + h;
//       if (top + H > SCREEN_H - MARGIN) top = y - H;
//       left = Math.max(MARGIN, Math.min(left, SCREEN_W - W - MARGIN));
//       setPos({ left, top });
//     });
//   }, [mode]);

//   const open = () => {
//     updatePosition();
//     setTempDate(value || new Date());
//     setVisible(true);
//   };

//   const onPickerLayout = (e: LayoutChangeEvent) => {
//     setTimeout(updatePosition, 0);
//   };

//   const onDayPress = (date: Date) => {
    
//     if (mode === 'date') {
//       onChange(date);
//       setVisible(false);
//     } else {
//       setTempDate(date);
//     }
//   };

//   const onTimeConfirm = (date: Date) => {
//     onChange(date);
//   };

//   const display = value
//     ? mode === 'time'
//       ? formatTime12h(value)
//       : mode === 'datetime'
//       ? `${formatDateToString(value)}, ${formatTime12h(value)}`
//       : formatDateToString(value)
//     : placeholder;

//   return (
//     <>
//       <TouchableOpacity
//         ref={ref}
//         onPress={open}
//         onLayout={onPickerLayout}
//         style={[styles.input, style]}
//         activeOpacity={0.7}
//       >
//         <Text style={{ color: value ? '#000' : '#888' }}>{display}</Text>
//       </TouchableOpacity>

//       <Modal
//         isVisible={visible}
//         onBackdropPress={() => setVisible(false)}
//         backdropColor="transparent"
//         animationIn="fadeIn"
//         animationOut="fadeOut"
//         style={{ margin: 0 ,...theme.shadows.lg}}
//       >
//         <View
//           style={[
//             styles.popup,
//             {
//               left: pos.left,
//               top: pos.top,
//               width: mode === 'time' ? TIME_W : DATE_W,
//               ...theme.shadows.lg
//             },
//           ]}
//         >
//           {mode !== 'time' ? (
//             // <Calendar
//             //   current={value ? formatDateToString(value) : undefined}
//             //   onDayPress={onDayPress}
//             //   style={{ flex: 1 }}
//             // />
//             <XCalendar
//               selected={value}
//               onSelect={(d)=>onDayPress(d)}
//               // theme={{ primary: '#1D62D8', background: '#f9f9f9' }}
//             />
//           ) : (
//             <XTimeWheel value={value} onChange={function (value: Date): void {
//                 onTimeConfirm(value)
//               } }/>
//           )}
//         </View>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   popup: {
//     position: 'absolute',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   timeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timeBtns: {
//     flexDirection: 'row',
//     marginTop: 16,
//   },
//   btn: {
//     marginHorizontal: 12,
//     padding: 8,
//     borderWidth: 1,
//     borderRadius: 4,
//     borderColor: '#ccc',
//   },
// });
// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, UIManager, findNodeHandle } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { format } from 'date-fns';
// import { useTheme } from '../theme';

// const { width, height } = Dimensions.get('window');

// interface XDatePickerProps {
//   value?: Date;
//   onChange: (date: Date) => void;
//   placeholder?: string;
//   formatPattern?: string;
//   mode?: 'date' | 'datetime' | 'time';
//   style?: any;
// }

// const XDatePicker: React.FC<XDatePickerProps> = ({
//   value = new Date(),
//   onChange,
//   placeholder = 'Chọn ngày',
//   formatPattern = 'dd/MM/yyyy',
//   mode = 'date',
//   style,
// }) => {
//   const [showPicker, setShowPicker] = useState(false);
//   const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
//   const pickerRef = useRef<View>(null);
//   const theme = useTheme();

//   useEffect(() => {
//     if (pickerRef.current && showPicker) {
//       const node = findNodeHandle(pickerRef.current);
//       if (node) {
//         UIManager.measureInWindow(node, (x, y, width, height) => {
//           const screenHeight = Dimensions.get('window').height;
//           const popupHeight = 300;
//           const margin = 10;
//           let showAbove = false;
//           let top = y + height;
//           if (y + height + popupHeight > screenHeight - margin) {
//             showAbove = true;
//             top = y - popupHeight;
//           }
//           setPickerPosition({ top, left: x, width, showAbove });
//         });
//       }
//     }
//   }, [showPicker]);

//   const handleDateChange = (event: any, selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       onChange(selectedDate);
//     }
//     setShowPicker(false);
//   };

//   const handleOpenPicker = () => {
//     setShowPicker(true);
//   };

//   const handleClosePicker = () => {
//     setShowPicker(false);
//   };

//   const formattedDate = value ? format(value, formatPattern) : placeholder;

//   return (
//     <View style={[styles.container, style]} ref={pickerRef}>
//       <TouchableOpacity onPress={handleOpenPicker} style={styles.input}>
//         <Text style={styles.text}>{formattedDate}</Text>
//       </TouchableOpacity>
//       <Modal visible={showPicker} transparent animationType="fade" onRequestClose={handleClosePicker}>
//         <TouchableOpacity style={styles.modalOverlay} onPress={handleClosePicker} activeOpacity={1}>
//           <View
//             style={[
//               styles.modalContent,
//               {
//                 top: pickerPosition.showAbove ? pickerPosition.top : pickerPosition.top,
//                 left: pickerPosition.left,
//                 width: pickerPosition.width,
//                 position: 'absolute',
//               },
//             ]}
//           >
//             <DateTimePicker
//               value={value}
//               mode={mode}
//               display="default"
//               onChange={handleDateChange}
//               textColor={theme.colors.text}
//               accentColor={theme.colors.primary}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   text: {
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     height:200,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     height:200
//   },
// });

// export default XDatePicker;


// src/shared/components/XDateTimePicker.tsx
// src/shared/components/XDateTimePicker.tsx
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

const { width: SW } = Dimensions.get('window');
const POPUP_H = 360;

type Mode = 'date'|'time'|'datetime';
type Props = {
  mode?: Mode;
  value?: Date;
  onChange: (d: Date) => void;
  placeholder?: string;
  style?: any;
};

export function XDateTimePicker({
  mode='date', value, onChange, placeholder='Chọn...', style
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

  return (
    <>
      <TouchableOpacity
        ref={touchableRef}
        onPress={() => setShow(true)}
        style={[styles.input, style]}
        activeOpacity={0.7}
      >
        <Text style={{color: value?'#000':'#888'}}>{display}</Text>
      </TouchableOpacity>

      <Popover
        isVisible={show}
        from={touchableRef}
        onRequestClose={() => setShow(false)}
        popoverStyle={styles.popover}
        // arrowStyle={styles.arrow}
        backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        <View style={{ width: mode =='date'? SW - 16 * 2:SW/2 - 16 * 2, maxHeight: POPUP_H }}>
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
      </Popover>
    </>
  );
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,borderColor:'#ccc',
    padding:12,borderRadius:6,backgroundColor:'#fff'
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
