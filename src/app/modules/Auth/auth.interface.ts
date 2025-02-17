import { USER_ROLE } from '../User/user.constant';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  profilePhoto?: string;
  role: keyof typeof USER_ROLE;
};
