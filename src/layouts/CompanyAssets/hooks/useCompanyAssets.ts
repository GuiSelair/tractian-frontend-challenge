import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import { Company, fetchCompanies } from "../../../services/http/companyApi/fetchCompanies"
import { fetchCompanyLocations } from "../../../services/http/companyApi/fetchCompanyLocations"
import { fetchCompanyAssets } from "../../../services/http/companyApi/fetchCompanyAssets"
import { Node } from "../../../components"
import { useCompanyAssetsFiltered } from "./useCompanyAssetsFiltered"

export function useCompanyAssets() {
	const { companyId } = useParams<{ companyId: string }>()
	const { checkIfSatisfiedFilters, handleSelectFilterByCritical, handleSelectFilterByEnergy, hasCriticalFilter, hasEnergyFilter } = useCompanyAssetsFiltered()
	
	const [isInitialLoading, setInitialLoading] = useState(true)
	const [isCompanyDataLoading, setIsCompanyDataLoading] = useState(false)
	const [companies, setCompanies] = useState<Company[]>([])
	const [locations, setLocations] = useState<Node[]>([])
	const [assets, setAssets] = useState<Node[]>([])

	const selectedCompanyName = companies?.find(company => company.id === companyId)?.name || ''

	function buildNodeStructure(nodes: Node[], type: 'location' | 'asset') {
		const structure = new Map<string, Node>()
		const subNodes = new Map<string, Node>()
		
		nodes.sort((a, b) => {
			if (a.parentId === null || b.parentId === null) return -1;
			return 1;
		});

		nodes.forEach(node => {
			node.type = type

			if (checkIfSatisfiedFilters(node)) {
				return
			}

			if (node.parentId){
				if (subNodes.has(node.parentId)){
					const sn = subNodes.get(node.parentId)
					sn?.nodes.push({ ...node, nodes: [] })
					return
				}

				subNodes.set(node.id, { ...node, nodes: [] })
				return
			}

			structure.set(node.id, { ...node, nodes: [], ...(type === 'asset' && { locationId: node.locationId }) })
		})

		subNodes.forEach((value) => {
			if (value.parentId && subNodes.has(value.parentId)){
				const sn = subNodes.get(value.parentId)
				sn?.nodes.push({ ...value, nodes: [] })
				return
			}
		})

		subNodes.forEach(subNode => {
			const hasLocation = structure.has(subNode.parentId!)
			if (hasLocation) {
				const fatherNode = structure.get(subNode.parentId!)
				fatherNode?.nodes.push(subNode)
				structure.set(fatherNode!.id, fatherNode!)
			}
		})

		return structure
	}

	function unionAssetsToLocations(locations: Map<string, Node>, assets: Map<string, Node>) {
		const finalTreeData = locations

		assets.forEach((value, key) => {
			const locationId = value.locationId
			
			if (locationId){
				if (locations.has(locationId)) {
					const location = locations.get(locationId)
					location?.nodes.push(value)
					finalTreeData.set(location!.id, location!)
				} else {
					finalTreeData.forEach((loc) => {
						const index = loc.nodes.findIndex(node => node.id === locationId)
						if (index !== -1) {
							loc.nodes[index].nodes.push(value)
						}
					})
				}
				return
			}

			finalTreeData.set(key, value)
		})
		return finalTreeData
	}

	const treeData = useMemo(() => {
		const locationStructure = buildNodeStructure(locations, 'location')
		const assetsStructure = buildNodeStructure(assets, 'asset')
		const finalTree = unionAssetsToLocations(locationStructure, assetsStructure)
		return finalTree
	}, [locations, assets, hasCriticalFilter, hasEnergyFilter])

	function handleNavigateToAsset(assetId: string): string{
		return `/${companyId}/asset/${assetId}`
	}

	async function getCompanies(){
		try {
			const companiesResponse = await fetchCompanies()
			setCompanies(companiesResponse)
		} catch (error) {
			console.log(error)
		} finally {
			setInitialLoading(false)
		}
	}

	async function getCompanyData(){
		if (!companyId){ return }
		try {
			setIsCompanyDataLoading(true)
			const [locationsResponse, assetsResponse] = await Promise.all([
				fetchCompanyLocations(companyId),
				fetchCompanyAssets(companyId)
			])
			setLocations(locationsResponse)
			setAssets(assetsResponse)
		} catch (error) {
			console.log(error)
		} finally {
			setIsCompanyDataLoading(false)
		}
	}

	useEffect(() => {
		getCompanies()
	}, [])

	useEffect(() => {
		if (!companyId) { return }
		getCompanyData()
	}, [companyId])

	return {
		treeData,
		handleNavigateToAsset,
		companies,
		isInitialLoading,
		nonCompanySelected: !companyId,
		isCompanyDataLoading,
		selectedCompanyName,
		handleSelectFilterByEnergy,
		handleSelectFilterByCritical,
		hasCriticalFilter,
		hasEnergyFilter
	}
}