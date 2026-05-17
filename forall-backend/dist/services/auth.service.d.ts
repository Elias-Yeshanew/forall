import { SafeUser, TokenPair } from '../types/auth';
export declare function loginService(email: string, password: string): Promise<{
    user: SafeUser;
    tokens: TokenPair;
}>;
export declare function refreshTokenService(refreshToken: string): Promise<{
    user: SafeUser;
    tokens: TokenPair;
}>;
export declare function getMeService(userId: string): Promise<SafeUser>;
//# sourceMappingURL=auth.service.d.ts.map