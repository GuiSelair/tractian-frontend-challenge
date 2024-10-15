import { Node } from '../../../components/TreeView'

export async function fetchCompanyAssets(companyId: string) {
	const assetsRaw = await fetch(`https://fake-api.tractian.com/companies/${companyId}/assets`)
	const assets = await assetsRaw.json()
	return assets as Node[]
}