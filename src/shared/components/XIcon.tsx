import React from 'react';
import User from '../assets/icons/User.svg';
import PasswordCheck from '../assets/icons/PasswordCheck.svg';
import ShowPassword from '../assets/icons/ShowPassword.svg';
import HidePassword from '../assets/icons/HidePassword.svg';
import { StyleProp, ViewStyle } from 'react-native';
import Logo from '../assets/icons/Logo.svg';
import Pen from '../assets/icons/Pen.svg';
import Home from '../assets/icons/Home.svg';
import Profile from '../assets/icons/Profile.svg';
import Camera from '../assets/icons/Camera.svg';
import BackArrow from '../assets/icons/BackArrow.svg';
import FaceID from '../assets/icons/FaceID.svg';
import Bell from '../assets/icons/Bell.svg';
import Ticket from '../assets/icons/Ticket.svg';
import Appointment from '../assets/icons/Appointment.svg';
import Payroll from '../assets/icons/Payroll.svg';
import Report from '../assets/icons/Report.svg';
import X from '../assets/icons/X.svg';
import Search from '../assets/icons/Search.svg';
import DownArrow from '../assets/icons/DownArrow.svg';
import IconCategory from '../assets/icons/IconCategory.svg';
import ClockIn from '../assets/icons/ClockIn.svg';
import ClockOut from '../assets/icons/ClockOut.svg';
import NoData from '../assets/icons/NoData.svg';
import Clock from '../assets/icons/Clock.svg';
import CurrencyCircleDollar from '../assets/icons/CurrencyCircleDollar.svg';
import Customer from '../assets/icons/Customer.svg';
import Date from '../assets/icons/Date.svg';
import Time from '../assets/icons/Time.svg';
import Menu from '../assets/icons/Menu.svg';
import LogoWhite from '../assets/icons/LogoWhite.svg';
import Group1 from '../assets/icons/Group1.svg';
import Group2 from '../assets/icons/Group2.svg';
import ReadAll from '../assets/icons/ReadAll.svg';
import AddAppointment from '../assets/icons/AddAppointment.svg';
import CloseCircle from '../assets/icons/CloseCircle.svg';
import AddCircle from '../assets/icons/AddCircle.svg';
import CaretDown from '../assets/icons/CaretDown.svg';
import CaretUp from '../assets/icons/CaretUp.svg';

export const iconMap = {
  user: User,
  passwordCheck: PasswordCheck,
  showPassword: ShowPassword,
  hidePassword: HidePassword,
  logo: Logo,
  pen: Pen,
  home: Home,
  profile: Profile,
  camera: Camera,
  backArrow: BackArrow,
  faceID: FaceID,
  bell: Bell,
  ticket: Ticket,
  appointment: Appointment,
  payroll: Payroll,
  report: Report,
  x: X,
  search: Search,
  downArrow: DownArrow,
  iconCategory: IconCategory,
  clockIn: ClockIn,
  clockOut: ClockOut,
  noData: NoData,
  clock: Clock,
  currencyCircleDollar: CurrencyCircleDollar,
  customer: Customer,
  date: Date,
  time: Time,
  menu: Menu,
  LogoWhite: LogoWhite,
  group1: Group1,
  group2: Group2,
  readAll: ReadAll,
  addAppointment: AddAppointment,
  closeCircle: CloseCircle,
  addCircle: AddCircle,
  caretDown: CaretDown,
  caretUp: CaretUp,
};

 type XIconProps = {
  name: keyof typeof iconMap;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function XIcon({ name, width = 24, height = 24, color = '#000', style }: XIconProps) {
  const Component = iconMap[name];
  return <Component width={width} height={height} color={color} style={style} />;
}
