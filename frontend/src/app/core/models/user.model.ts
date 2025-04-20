export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Role {
    id: number;
    name: ERole;
}

export enum ERole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN'
} 