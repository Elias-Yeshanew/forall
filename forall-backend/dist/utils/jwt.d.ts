import { JwtPayload, TokenPair } from '../types/auth';
import { UserRole } from '@prisma/client';
export declare function signAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
export declare function signRefreshToken(userId: string): string;
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function verifyRefreshToken(token: string): {
    sub: string;
};
export declare function generateTokenPair(user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
}): TokenPair;
//# sourceMappingURL=jwt.d.ts.map