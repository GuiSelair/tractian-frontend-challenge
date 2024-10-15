import { useSearchParams } from 'react-router-dom'

import { Node } from "../../../components"

export function useCompanyAssetsFiltered(){
	const [searchParams, setSearchParams] = useSearchParams()
	
	const hasEnergyFilter = searchParams.get('energy')
	const hasCriticalFilter = searchParams.get('alert')

	function checkIfSatisfiedFilters(node: Node){
		if (hasEnergyFilter && node.type === 'asset' && node.sensorType !== 'energy') {
			return true
		}

		if (hasCriticalFilter && node.type === 'asset' && node.status !== 'alert') {
			return true
		}

		return false
	}

	function handleSelectFilterByEnergy(){
		setSearchParams(prev => {

			if (prev.has('energy')){
				prev.delete('energy')
			} else {
				prev.set('energy', '1')
			}
			return prev
		})
	}

	function handleSelectFilterByCritical(){
		setSearchParams(prev => {
			if (prev.has('alert')){
				prev.delete('alert')
			} else {
				prev.set('alert', '1')
			}
			return prev
		})
	}

	return {
		checkIfSatisfiedFilters,
		handleSelectFilterByCritical,
		handleSelectFilterByEnergy, 
		hasEnergyFilter,
		hasCriticalFilter
	}
}