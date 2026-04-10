import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useHeader } from "../contexts/HeaderContext";

const AppHeader = () => {
  const {isOpen, toggleUserMenu} = useHeader()
  const { toggleSidebar } = useSidebar()
  return (
    <>
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-slate-700 bg-slate-800">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start rtl:justify-end">
        <button aria-controls="top-bar-sidebar" type="button" onClick={toggleSidebar} className="sm:hidden text-white bg-transparent box-border border border-transparent hover:bg-slate-700 focus:ring-4 focus:ring-slate-500 font-medium leading-5 rounded-md text-sm p-2 focus:outline-none">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
   </svg>
         </button>
        <a href="https://flowbite.com" className="flex ms-2 md:me-24">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3" alt="FlowBite Logo" />
          <span className="self-center whitespace-nowrap text-lg font-semibold text-white">Flowbite</span>
        </a>
      </div>
      <div className="flex items-center">
          <div className="relative flex items-center ms-3">
            <div>
              <button type="button" onClick={toggleUserMenu} className="flex rounded-full bg-slate-700 text-sm focus:ring-4 focus:ring-slate-500" aria-expanded={isOpen}>
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
              </button>
            </div>
            <div className={`absolute right-0 top-full mt-2 z-[60] ${isOpen ? "block" : "hidden"} bg-slate-800 border border-slate-700 rounded-md shadow-lg w-44`} id="dropdown-user">
              <div className="px-4 py-3 border-b border-slate-700" role="none">
                <p className="text-sm font-medium text-white" role="none">
                  Neil Sims
                </p>
                <p className="text-sm text-slate-300 truncate" role="none">
                  neil.sims@flowbite.com
                </p>
              </div>
              <ul className="p-2 text-sm text-slate-100 font-medium" role="none">
                <li>
                  <Link to="#" className="inline-flex items-center w-full p-2 hover:bg-slate-700 hover:text-white rounded-md" role="menuitem">Sign out</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

    </>
  );
};

export default AppHeader;