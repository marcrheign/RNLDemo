import AxiosInstance from "./AxiosInstance";

interface LoadGendersResponse {
  genders: Array<{ id: number; gender: string }>;
}

interface StoreGenderRequest {
  gender: string;
}

const GenderService = {

loadGenders: async () => {
return AxiosInstance.get<LoadGendersResponse>("/gender/loadGenders");
},

storeGender: async (data: StoreGenderRequest) => {
return AxiosInstance.post("/gender/storeGender", data);
}

};

export default GenderService;