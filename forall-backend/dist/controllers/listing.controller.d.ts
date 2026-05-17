import { Request, Response, NextFunction } from 'express';
export declare function getListings(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getListingById(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createListing(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getListingsAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPosterDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateListing(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateListingStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteListing(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getListingStats(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadListingImages(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=listing.controller.d.ts.map