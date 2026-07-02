import { User } from './user.model';

export interface CurrentUserResponse {
    user: User;
    roles: string[];
    permissions: string[];
}