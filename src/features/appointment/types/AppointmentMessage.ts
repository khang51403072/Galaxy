import { DataAppt } from "./ApptSaveResponse";

// --- Helper Functions (Không thay đổi) ---
export interface ApptMessage {
    message: string;
    date: string;
    actionType: string;
    apptId: string;
    customerId: string;
}

export function createApptMessage(data: DataAppt): ApptMessage {
    return {
        message: "appointment-booking",
        date: data.apptDate,
        actionType: "save-apt",
        apptId: data.id,
        customerId: data.customer.id,
    };
}