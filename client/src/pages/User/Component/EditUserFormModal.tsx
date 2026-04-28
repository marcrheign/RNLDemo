import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import type { AxiosError } from "axios";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import GenderService from "../../../services/GenderService";
import UserService, { type UpdateUserPayload } from "../../../services/UserService";

interface EditUserFormModalProps {
  isOpen: boolean;
  userId: number | null;
  onClose: () => void;
  onUserUpdated: (message: string) => void;
}

interface UserFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender: string;
  birth_date: string;
  username: string;
}

interface UserFieldErrors {
  first_name?: string[];
  last_name?: string[];
  gender?: string[];
  birth_date?: string[];
  username?: string[];
}

interface GenderOption {
  gender_id: number;
  gender: string;
}

interface ValidationErrorResponse {
  errors: UserFieldErrors;
}

const defaultFormData: UserFormData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix_name: "",
  gender: "",
  birth_date: "",
  username: "",
};

const EditUserFormModal: FC<EditUserFormModalProps> = ({ isOpen, userId, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState<UserFormData>({ ...defaultFormData });
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [genders, setGenders] = useState<GenderOption[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleLoadGenders = async () => {
    try {
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders ?? []);
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading genders:", error);
    }
  };

  const handleLoadUser = async (id: number) => {
    try {
      const res = await UserService.getUser(id);
      if (res.status === 200 && res.data.user) {
        const user = res.data.user;
        const formattedBirthDate = user.birth_date ? String(user.birth_date).split("T")[0] : "";

        setFormData({
          first_name: user.first_name ?? "",
          middle_name: user.middle_name ?? "",
          last_name: user.last_name ?? "",
          suffix_name: user.suffix_name ?? "",
          gender: String(user.gender_id ?? ""),
          birth_date: formattedBirthDate,
          username: user.username ?? "",
        });
      }
    } catch (error) {
      console.error("Unexpected server error occurred during getting user:", error);
    }
  };

  useEffect(() => {
    if (!isOpen || !userId) return;
    setErrors({});
    void handleLoadGenders();
    void handleLoadUser(userId);
  }, [isOpen, userId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: UserFieldErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = ["The first name field is required."];
    if (!formData.last_name.trim()) newErrors.last_name = ["The last name field is required."];
    if (!formData.gender) newErrors.gender = ["The gender field is required."];
    if (!formData.birth_date) newErrors.birth_date = ["The birth date field is required."];
    if (!formData.username.trim()) newErrors.username = ["The username field is required."];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    void handleUpdateUser();
  };

  const handleUpdateUser = async () => {
    if (!userId) return;

    try {
      setLoadingSave(true);
      setErrors({});

      const payload: UpdateUserPayload = {
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim(),
        last_name: formData.last_name.trim(),
        suffix_name: formData.suffix_name.trim(),
        gender_id: Number(formData.gender),
        birth_date: formData.birth_date,
        username: formData.username.trim(),
      };

      const res = await UserService.updateUser(userId, payload);
      if (res.status === 200) {
        onClose();
        onUserUpdated(res.data?.message ?? "User Successfully Updated.");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ValidationErrorResponse>;
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        console.error("Unexpected server error occurred during updating user:", error);
      }
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">Edit User Form</h1>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                errors={errors.first_name}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                errors={errors.last_name}
                required
              />
            </div>

            <div className="mb-4">
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={formData.suffix_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <FloatingLabelSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                errors={errors.gender}
                required
              >
                <option value="">Select Gender</option>
                {genders.map((gender, index) => (
                  <option value={gender.gender_id} key={index}>
                    {gender.gender}
                  </option>
                ))}
              </FloatingLabelSelect>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                errors={errors.birth_date}
                required
              />
            </div>

            <div className="mb-4">
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                errors={errors.username}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton label="Update User" loading={loadingSave} loadinglabel="Updating User..." />
        </div>
      </form>
    </Modal>
  );
};

export default EditUserFormModal;
