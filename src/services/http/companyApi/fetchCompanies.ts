export interface Company {
	id: string
	name: string
}

export async function fetchCompanies(){
	const companiesRaw = await fetch('https://fake-api.tractian.com/companies')
	const companies = await companiesRaw.json()
	return companies as Company[]
}