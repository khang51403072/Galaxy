import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import XInput from "@/shared/components/XInput";
import XIcon from "@/shared/components/XIcon";
import XText from "@/shared/components/XText";
import { BookingServiceEntity, useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { EmployeeEntity, getDisplayName } from "@/features/ticket/types/TicketResponse";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XRow } from "@/shared/components/XRow";

interface Props {
  services: BookingServiceEntity[];
  listEmployeeOnWork: EmployeeEntity[];
  onSelectService: (index: number) => void;
  onRemoveService: (index: number) => void;
  onSelectTechnician: (index: number, comboIndex?: number) => void;
}

export default function ServiceList({
  services,
  listEmployeeOnWork,
  onSelectService,
  onRemoveService,
  onSelectTechnician,
}: Props) {
  const theme = useTheme();

  const divider = useMemo(
    () => <View style={{ height: 1, backgroundColor: theme.colors.gray200, marginVertical: theme.spacing.sm }} />, [theme]
  );

  const renderService = (e: BookingServiceEntity, index: number) => {
    if (e?.service?.menuItemType === "ServicePackage") {
      return (
        <View style={{ flexDirection: "column", gap: 8 }}>
          {/* Service Package */}
          <TouchableOpacity
            onPress={() => onSelectService(index)}
            style={{ width: "100%" }}
          >
            <XInput
              value={e?.service?.name}
              editable={false}
              placeholder="Add Service"
              pointerEvents="none"
              iconRight={
                e.service ? "closeCircle" : (
                  <XIcon
                    name="addCircle"
                    height={20}
                    width={20}
                    color={theme.colors.primaryMain}
                  />
                )
              }
              onIconRightPress={() =>
                e.service ? onRemoveService(index) : onSelectService(index)
              }
            />
          </TouchableOpacity>

          {/* Combo items */}
          {e.comboItems?.map((item, comboIndex) => (
            <XRow align="flex-start">

              <View
                key={item.service?.id}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingLeft: theme.spacing.md,
                  width: "100%",
                  gap: 4,
                  paddingTop: theme.spacing.sm,
                }}
              >
                <XRow align="center" style={{gap: 8,}}>
                  <View style={{ backgroundColor: theme.colors.gray300, height: 8, width: 8, borderRadius: 8, }}></View>
                  <XInput
                    value={item?.service?.name}
                    editable={false}
                    placeholder="Add Service"
                    pointerEvents="none"
                    style={{ flex: 1 }}
                  />
                </XRow>

                <XRow align="center" style={{gap: 8,}}>
                  <View style={{ height: 8, width: 8, borderRadius: 8, }}></View>
                  <TouchableOpacity
                    style={{ flex:1 }}
                    onPress={() => onSelectTechnician(index, comboIndex)}
                  >
                    <XInput
                      value={item.technician ? getDisplayName(item.technician) : ""}
                      editable={false}
                      placeholder="Choose Technician"
                      pointerEvents="none"
                      style={{ flex: 1 }}
                    />
                  </TouchableOpacity>
                </XRow>

              </View>
            </XRow>

          ))
          }
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => onSelectService(index)}>
        <XInput
          value={e?.service?.name}
          editable={false}
          placeholder="Add Service"
          pointerEvents="none"
          iconRight={
            e.service ? "closeCircle" : (
              <XIcon
                name="addCircle"
                height={20}
                width={20}
                color={theme.colors.primaryMain}
              />
            )
          }
          onIconRightPress={() =>
            e.service ? onRemoveService(index) : onSelectService(index)
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ gap: theme.spacing.sm, }}>
      {services.map((e, index) => (
        <View key={index} style={{ gap: theme.spacing.sm, }}>
          {renderService(e, index)}
          {/* Technician Picker (normal service) */}
          {e.service &&
            e.service?.menuItemType !== "ServicePackage" && (
              <TouchableOpacity
                onPress={() => onSelectTechnician(index)}
                style={{ width: "100%", }}
              >
                <XInput
                  value={e.technician ? getDisplayName(e.technician) : ""}
                  editable={false}
                  placeholder="Choose Technician"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            )}

          {index !== services.length - 1 && divider}
        </View>
      ))}
    </View>
  );
}
