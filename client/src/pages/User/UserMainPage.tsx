import { useModal } from "../../hooks/UseModal";
import AddUserFormModal from "./Component/AddUserFormModal";
import UserList from "./Component/UserList";

const UserMainPage = () => {
const { isOpen, openModal, closeModal } = useModal(false);

return (
  <>
    <AddUserFormModal isOpen={isOpen} onClose={closeModal} />
    <UserList onAdduser={openModal} />
  </>
);
};

export default UserMainPage;