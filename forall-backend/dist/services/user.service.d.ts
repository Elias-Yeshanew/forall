import { UserRole } from '@prisma/client';
export declare function getAllUsersService(): Promise<{
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
}[]>;
export declare function createUserService(dto: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}): Promise<{
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
}>;
export declare function updateUserService(id: string, dto: {
    name?: string;
    role?: UserRole;
    isActive?: boolean;
}): Promise<{
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
}>;
export declare function deleteUserService(id: string): Promise<void>;
//# sourceMappingURL=user.service.d.ts.map