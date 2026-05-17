interface SalesNotifyParams {
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    message: string;
    listingTitle: string;
    listingId: string;
}
export declare const emailService: {
    notifySalesTeam(params: SalesNotifyParams): Promise<void>;
    sendListingPublished(email: string, listingTitle: string): Promise<void>;
};
export {};
//# sourceMappingURL=email.service.d.ts.map