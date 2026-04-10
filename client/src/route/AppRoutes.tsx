import { Route, Routes } from "react-router-dom"
import AppLayout from "../layout/AppLayout"

const SampleComponent = () => {
  return (
    <h1 className="text-red-600">Hello World</h1>
  )
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SampleComponent />} />
      </Route>
    </Routes>
  )
}
