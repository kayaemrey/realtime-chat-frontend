import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "./api";

export interface UserLite {
  email?: string;
  userName?: string;
  fullName?: string;
}

interface AuthState {
  token: string | null;
  me: UserLite | null;
  loading: boolean;
  error: string | null;
  info: string | null;
}
const persisted = (() => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) return JSON.parse(raw) as Pick<AuthState, "token" | "me">;
  } catch {
    /* empty */
  }
  return { token: null, me: null };
})();

const initialState: AuthState = {
  token: persisted.token,
  me: persisted.me,
  loading: false,
  error: null,
  info: null,
};

function save(state: AuthState) {
  try {
    localStorage.setItem(
      "auth",
      JSON.stringify({ token: state.token, me: state.me })
    );
  } catch {
    /* empty */
  }
}

//thunks
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    p: {
      email: string;
      password: string;
      username: string;
      fullname: string;
      privacyAccepted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      return await AuthApi.register(p);
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || e.message || "Kayıt hatası"
      );
    }
  }
);
export const verifyEmailThunk = createAsyncThunk(
  "auth/verifyEmail",
  async (p: { code: string }, { rejectWithValue }) => {
    try {
      return await AuthApi.verifyEmail(p);
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || e.message || "Doğrulama hatası"
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (p: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await AuthApi.login(p);
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || e.message || "Giriş hatası"
      );
    }
  }
);

export const forgetPasswordThunk = createAsyncThunk(
  "auth/forgetPassword",
  async (p: { email: string }, { rejectWithValue }) => {
    try {
      return await AuthApi.forgetPassword(p);
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || e.message || "Talep hatası"
      );
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (p: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      return await AuthApi.resetPassword(p);
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || e.message || "Şifre hatası"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.me = null;
      state.error = null;
      state.info = "Çıkış yapıldı.";
      save(state);
    },
    clearStatus(state) {
      state.error = null;
      state.info = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
      state.info = null;
    };
    const rejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload || action.error?.message || "Hata";
    };

    builder
      // register
      .addCase(registerThunk.pending, pending)
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.info = "Kayıt başarılı. Lütfen e-postanızı doğrulayın.";
      })
      .addCase(registerThunk.rejected, rejected)

      // verify
      .addCase(verifyEmailThunk.pending, pending)
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.loading = false;
        state.info = "E-posta doğrulandı.";
      })
      .addCase(verifyEmailThunk.rejected, rejected)

      // login
      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const token =
          action.payload?.token || action.payload?.accessToken || null;
        state.token = token;
        state.me = {
          email: action.payload?.email,
          userName: action.payload?.userName,
          fullName: action.payload?.fullName,
        };
        state.info = token ? "Giriş başarılı." : "Giriş yanıtı alındı.";
        save(state);
      })
      .addCase(loginThunk.rejected, rejected)

      // forget
      .addCase(forgetPasswordThunk.pending, pending)
      .addCase(forgetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.info = "Sıfırlama e-postası gönderildi (eğer kayıtlıysa).";
      })
      .addCase(forgetPasswordThunk.rejected, rejected)

      // reset
      .addCase(resetPasswordThunk.pending, pending)
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.info = "Şifre güncellendi.";
      })
      .addCase(resetPasswordThunk.rejected, rejected);
  },
});

export const {logout, clearStatus} = authSlice.actions;

export default authSlice.reducer;
