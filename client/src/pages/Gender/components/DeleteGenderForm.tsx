import BackButton from "../../../components/Button/BackButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"

const DeleteGenderForm = () => {
  return (
   <>
      <form>
        <div className="mb-4">
          <FloatingLabelInput label="Gender" type="text" name="gender" />
        </div>

        <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/"/>
          <SubmitButton label="Save Gender" newClassName="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg" />
        </div>
      </form>
    
    </>
  )
}

export default DeleteGenderForm