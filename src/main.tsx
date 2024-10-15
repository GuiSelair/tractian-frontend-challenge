import './global.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { applicationRouter } from './router'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={applicationRouter} />
  </StrictMode>,
)
