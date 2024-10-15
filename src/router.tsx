import { createBrowserRouter } from "react-router-dom";

import { PreviewAssetPage } from './views'
import { CompanyAssetsLayout } from './layouts/CompanyAssets'

export const applicationRouter = createBrowserRouter([
	{
		element: <CompanyAssetsLayout />,
		children: [
			{	path: '/'	},
			{
				id: 'company-asset-viewer',
				path: '/:companyId',
			},
			{
				id: 'company-asset-preview',
				path: '/:companyId/asset/:assetId',
				element: <PreviewAssetPage/>
			}
		]
	}
])