import { User } from './user.model';

export interface LoginResponse {
    user: User;
    roles: string[];
    permissions: string[];
    token: string;
}