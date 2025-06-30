import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { getDashboardStats } from '../usecase/DashboardUseCase';
import { DashboardStats } from '../services/DashboardApi';
import { XColors } from '../../../shared/constants/colors';
import XText from '../../../shared/components/XText';
import TitleGroup from '../components/TitleGroup';
import RowInfo from '../components/RowInfo';
import XButton from '../../../shared/components/XButton';
import XDivider from '../../../shared/components/XDivider';
import XScreen from '../../../shared/components/XScreen';
import { useAuthStore } from '../../auth/stores/authStore';
import { useShallow } from 'zustand/react/shallow';

export default function DashBoardScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  // Get user info from auth store
  const { userName, firstName, lastName, logout } = useAuthStore(
    useShallow((state) => ({
      userName: state.userName,
      firstName: state.firstName,
      lastName: state.lastName,
      logout: state.logout,
    }))
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get dashboard stats from usecase
      const data = await getDashboardStats();
      setDashboardStats(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by AppNavigator
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // // Load data on mount
  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

  return (
    <XScreen
      loading={loading}
      error={error}
      onRetry={loadDashboardData}
      scrollable={true}
      paddingHorizontal={0} // Remove default padding for custom layout
    >
      {/* Header Section */}
      <View style={{ width: '100%', height: '25%', backgroundColor: XColors.primary }}>
        {/* Header content can go here */}
      </View>
      
      {/* Content Section */}
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        {/* Dashboard Stats Section */}
        <TitleGroup title="Dashboard Statistics" onPress={() => {}} />
        <RowInfo titleLeft='Total Check-ins' titleRight={dashboardStats?.totalCheckIns?.toString() || 'Loading...'} />
        <RowInfo titleLeft='Total Hours' titleRight={dashboardStats?.totalHours?.toString() || 'Loading...'} />
        <RowInfo titleLeft='Current Streak' titleRight={dashboardStats?.currentStreak?.toString() || 'Loading...'} />
        <RowInfo titleLeft='Monthly Progress' titleRight={`${dashboardStats?.monthlyProgress || 0}%`} />
        <XDivider />
        
        {/* User Information Section */}
        <TitleGroup titleIcon='Edit' title="Information" icon="pen" onPress={() => {}} />
        <RowInfo titleLeft='Name' titleRight={`${firstName || ''} ${lastName || ''}`} />
        <RowInfo titleLeft='Username' titleRight={userName || 'Loading...'} />
        <XDivider />
        
        {/* Password Section */}
        <TitleGroup titleIcon='Change' title="Password" icon="pen" onPress={() => {}} />
        <XDivider />
        
        {/* Work Details Section */}
        <TitleGroup onPress={() => {}} title="Work Details" />
        <RowInfo titleLeft='Shift' titleRight="Morning" />
        <RowInfo titleLeft='Check-ins' titleRight="24 times" />
        <RowInfo titleLeft='Last Login' titleRight="2025-01-20" />
        <XDivider />
        
        {/* Face ID Section */}
        <TitleGroup 
          title="Sign In With Face ID" 
          onPress={() => {}} 
          type="switch" 
          switchValue={true} 
          onToggleChange={() => {}} 
        />
        
        {/* Logout Button */}
        <XButton 
          title='Log out' 
          onPress={handleLogout}
          useGradient={false} 
          backgroundColor={XColors.primary} 
          style={{ borderRadius: 8, marginTop: 16 }}
        />
        
        {/* Version Info */}
        <XText variant='content300' style={{ textAlign: 'center', marginTop: 16 }}>
          Version 1.0.0
        </XText>
      </View>
    </XScreen>
  );
}
