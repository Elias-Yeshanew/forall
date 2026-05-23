import { ContactStatus } from '@prisma/client';
export interface CreateContactDto {
    name: string;
    phone: string;
    email?: string;
    message: string;
    listingId: string;
}
export declare function createContactService(dto: CreateContactDto): Promise<{
    listing: {
        title: string;
    };
} & {
    message: string;
    email: string | null;
    name: string;
    id: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ContactStatus;
    listingId: string;
    assignedTo: string | null;
}>;
export declare function getContactsService(params: {
    status?: ContactStatus;
    page?: number;
    limit?: number;
}): Promise<{
    unread: number;
    data: ({
        listing: {
            type: import(".prisma/client").$Enums.ListingType;
            title: string;
        };
    } & {
        message: string;
        email: string | null;
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ContactStatus;
        listingId: string;
        assignedTo: string | null;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function updateContactService(id: string, dto: {
    status: ContactStatus;
    assignedTo?: string;
}): Promise<{
    listing: {
        title: string;
    };
} & {
    message: string;
    email: string | null;
    name: string;
    id: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ContactStatus;
    listingId: string;
    assignedTo: string | null;
}>;
export declare function getContactStatsService(): Promise<{
    total: number;
    unread: number;
    replied: number;
}>;
//# sourceMappingURL=contact.service.d.ts.map