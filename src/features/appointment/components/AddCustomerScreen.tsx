import { useXAlert } from "@/shared/components/XAlertContext";
import XButton from "@/shared/components/XButton";
import XInput from "@/shared/components/XInput";
import XScreen from "@/shared/components/XScreen";
import { useCallback } from "react";
import { Text, View } from "react-native";
import XDropdown from "@/shared/components/XDropdown";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useAddCustomerStore, addCustomerSelectors, Gender } from "../stores/addCustomerStore";
import { useShallow } from "zustand/react/shallow";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@/shared/hooks/useBackHandler";
import { goBack } from "@/app/NavigationService";
import { createAppointmentStore } from "../stores/appointmentStore";
import { useCreateAppointmentStore } from "../stores/createAppointmentStore";

export default function AddCustomerScreen() {
    const { showAlert } = useXAlert();
    const theme = useTheme();
    
    

    // Sử dụng store với shallow comparison để tránh re-render không cần thiết
    const { 
        formData, 
        isLoading, 
        error, 
        updateField, 
        saveCustomer,
        resetForm
    } = useAddCustomerStore(
        useShallow((state) => ({
            formData: addCustomerSelectors.selectFormData(state),
            isLoading: addCustomerSelectors.selectIsLoading(state),
            error: addCustomerSelectors.selectError(state),
            updateField: addCustomerSelectors.selectUpdateField(state),
            saveCustomer: addCustomerSelectors.selectSaveCustomer(state),
            resetForm: addCustomerSelectors.selectResetForm(state),
        }))
    );
    const navigation = useNavigation();
    // Sử dụng custom hook để handle back events
    useBackHandler(navigation, () => {
        resetForm();
        console.log('back handler');
    });
    const listGender: Gender[] = [
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
        {label: 'Non-Binary', value: 'NonBinary'},
        {label: 'Prefer Not To Say', value: 'PreferNotToSay'},
    ];
    
    // Optimize onChangeText handlers với useCallback
    const handlePhoneChange = useCallback((text: string) => {
        updateField('phone', text);
    }, [updateField]);
    
    const handleFirstNameChange = useCallback((text: string) => {
        updateField('firstName', text);
    }, [updateField]);
    
    const handleLastNameChange = useCallback((text: string) => {
        updateField('lastName', text);
    }, [updateField]);
    
    const handleEmailChange = useCallback((text: string) => {
        updateField('email', text);
    }, [updateField]);
    
    const handleDobChange = useCallback((text: string) => {
        updateField('dob', text);
    }, [updateField]);
    
    const handleNotesChange = useCallback((text: string) => {
        updateField('notes', text);
    }, [updateField]);
    
    const handleGenderSelect = useCallback((value: { value: Gender }) => {
        updateField('gender', value.value);
    }, [updateField]);
    
    const handleSave = useCallback(async () => {
        const success = await saveCustomer();
        if (success) {
            showAlert({
                title: "Success",
                message: "Customer created successfully",
                type: "success",
                onClose: async () => {
                    await useCreateAppointmentStore.getState().getCustomerLookup();
                    goBack();
                }
            });
        } else if (error) {
            showAlert({
                title: "Error",
                message: error,
                type: "error",
            });
        }
    }, [saveCustomer, error, showAlert]);
    
    const genderPicker = () => {
        return (
            <XDropdown 
                label="Gender"
                value={formData.gender}
                renderItem={(item, isSelected) => {
                    return <View 
                        style={{
                            borderBottomColor: theme.colors.border,
                            borderBottomWidth: 1,
                            paddingVertical: theme.spacing.sm,
                            paddingLeft: theme.spacing.sm, 
                            flexDirection: "row", 
                            alignItems: 'center', 
                            justifyContent: "flex-start"
                        }}>
                        <XText variant="headingRegular">{item.label}</XText>
                    </View>
                }}
                placeholder="Gender" 
                options={listGender.map((e) => ({label: e.label, value: e}))} 
                onSelect={handleGenderSelect} 
            />
        );
    };
    
    return (
        <XScreen 
            error={error}
            title="Add Customer" 
            dismissKeyboard={true} 
            loading={isLoading}
            footer={
                <XButton 
                    title="Save" 
                    onPress={handleSave}
                    loading={isLoading}
                />
            }
        >
            <View style={{gap: 16, paddingTop: 16}}>
                <XInput 
                    value={formData.phone}
                    onChangeText={handlePhoneChange}
                    placeholder="Enter Phone" 
                    label="Phone" 
                    isRequired 
                    keyboardType="phone-pad"
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <XInput 
                        value={formData.firstName} 
                        onChangeText={handleFirstNameChange} 
                        isRequired 
                        placeholder="Your first name" 
                        label="First name" 
                        style={{width: '48%'}}
                    />
                    <XInput 
                        value={formData.lastName} 
                        onChangeText={handleLastNameChange} 
                        placeholder="Your last name" 
                        label="Last name" 
                        style={{width: '48%'}}
                    />
                </View>
                <View style={{borderBottomWidth: 1, width: '100%', borderBottomColor: '#E0E0E0', }} />
                <XInput 
                    value={formData.email} 
                    onChangeText={handleEmailChange} 
                    placeholder="Enter email" 
                    label="Email" 
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <XInput 
                        value={formData.dob} 
                        onChangeText={handleDobChange} 
                        placeholder="DD/MM" 
                        label="DOB" 
                        style={{width: '48%'}}
                    />
                    {genderPicker()}
                </View>
                <XInput 
                    value={formData.notes} 
                    onChangeText={handleNotesChange} 
                    placeholder="Enter note" 
                    label="Notes" 
                />
            </View>
        </XScreen>
    );
}