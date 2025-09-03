export interface FormData {    
    firstName: string;
    lastName: string;
    phone: string;
    corporationNumber: string;
}

export interface CorporationValidationResponse {
    corporationNumber?: string;
    valid: boolean;
    message?: string;
}

export interface FormSubmissionResponse {
    message?: string;
}

export interface FormErrors {
    firstName?: string;
    lastName?: string;
    phone?: string;
    corporationNumber?: string;
    general?: string;
}