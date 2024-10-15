import { Node } from '../../../components/TreeView'

export async function fetchCompanyLocations(companyId: string) {
	const locationsRaw = await fetch(`https://fake-api.tractian.com/companies/${companyId}/locations`)
	const locations = await locationsRaw.json()
	return locations as Node[]
}