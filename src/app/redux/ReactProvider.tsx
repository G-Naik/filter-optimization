"use client"
import { Provider } from "react-redux"
import { store } from "./store"

interface RCProvider {
    children:React.ReactNode
}

export default function ReactProvider({children}:RCProvider) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
