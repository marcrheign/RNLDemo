import AxiosInstance from "./AxiosInstance";

export interface StoreUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender_id: number;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender_id: number;
  birth_date: string;
  username: string;
}

const UserService = {
  loadUsers: async () => AxiosInstance.get("/user/loadUsers"),
  getUser: async (userId: number) => AxiosInstance.get(`/user/getUser/${userId}`),
  storeUser: async (payload: StoreUserPayload) => AxiosInstance.post("/user/storeUser", payload),
  updateUser: async (userId: number, payload: UpdateUserPayload) =>
    AxiosInstance.put(`/user/updateUser/${userId}`, payload),
  deleteUser: async (userId: number) => AxiosInstance.delete(`/user/deleteUser/${userId}`),
};

export default UserService;
