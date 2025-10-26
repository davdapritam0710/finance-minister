export interface AuthResponse {}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
        lastLogin: string;
    };
    token: string;
}
