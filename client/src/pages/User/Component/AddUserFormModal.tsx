import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";

interface AddUserFormModalPros {
  isOpen: boolean
  onClose: () => void
}

interface UserFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender: string;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
}

interface UserFieldErrors {
  first_name?: string[];
  last_name?: string[];
  gender?: string[];
  birth_date?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const AddUserFormModal: FC<AddUserFormModalPros> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    gender: "",
    birth_date: "",
    username: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const genders = [
    {
      gender_id: '',
      gender: 'Select Gender'
    },
    {
      gender_id: 1,
      gender: 'Male'
    },
    {
      gender_id: 2,
      gender: 'Female'
    },
    {
      gender_id: 3,
      gender: 'Other'
    },
  ]

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
    if (!formData.password) newErrors.password = ["The password field is required."];
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ["The password confirmation field is required."];
    }

    if (!newErrors.username && formData.username.trim().toLowerCase() === "johndoe") {
      newErrors.username = ["The username has already been taken."];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
            Add User Form
          </h1>

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

              <div className="mb-4">
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  errors={errors.password}
                  required
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Password Confirmation"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  errors={errors.password_confirmation}
                  required
                />
              </div>
            </div>

          </div>
          <div className="flex justify-end gap-2">
            <CloseButton label="Close" onClose={onClose}/>
            <SubmitButton label="Save User"/>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AddUserFormModal;