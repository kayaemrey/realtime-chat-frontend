import api from "@/shared/lib/axios";

export const AuthApi = {
  register: (p: {
    email: string;
    password: string;
    username: string;
    fullname: string;
    privacyAccepted: boolean;
  }) => api.post("auth/register", p).then((r) => r.data),

  login: (p: { email: string; password: string }) =>
    api.post("auth/login", p).then((r) => r.data),

  verifyEmail: (p: { code: string }) =>
    api.post("auth/verifyEmail", p).then((r) => r.data),

  forgetPassword: (p: { email: string }) =>
    api.post("auth/forgetPassword", p).then((r) => r.data),

  resetPassword: (p: { token: string; password: string }) =>
    api.post("auth/resetPassword", p).then((r) => r.data),
};
