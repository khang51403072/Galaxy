import React from "react";
import { TouchableOpacity } from "react-native";
import XInput from "@/shared/components/XInput";
import { CustomerEntity } from "../types/CustomerResponse";
import { EmployeeEntity, getDisplayName } from "@/features/ticket/types/TicketResponse";

interface Props {
  customer?: CustomerEntity|null;
  onSelect: () => void;
}

export  function CustomerPicker({ customer, onSelect }: Props) {
    function getDisplayName(customer: CustomerEntity): string | undefined {
        return `${customer.firstName} ${customer.lastName}`
    }

  return (
    <TouchableOpacity onPress={onSelect} style={{ width: "100%" }}>
      <XInput
        value={customer ? getDisplayName(customer) : ""}
        editable={false}
        placeholder="Select Customer"
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
}


interface Props {
  technician?: EmployeeEntity;
  onSelect: () => void;
}

export  function TechnicianPicker({ technician, onSelect }: Props) {
  return (
    <TouchableOpacity onPress={onSelect}>
      <XInput
        value={technician ? getDisplayName(technician) : ""}
        editable={false}
        placeholder="Select Technician"
        iconRight="user"
      />
    </TouchableOpacity>
  );
}