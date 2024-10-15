import { useState } from 'react';
import { NavLink } from 'react-router-dom'

import ComponentIcon from '../../assets/icons/component.svg'
import AssetIcon from '../../assets/icons/asset.svg'
import LocationIcon from '../../assets/icons/location.svg'

import styles from './TreeView.module.scss'

type StringOrNull = string | null

export type Node = { 
	id: string
	name: string
	type: 'location' | 'asset'
	sensorType?: 'energy' | 'vibration' | null
	status?: 'operating' | 'alert' | null
	locationId?: StringOrNull
	parentId: StringOrNull
	nodes: Node[]
}

interface TreeViewProps {
  node: Node;
	onNavigate: (assetId: string) => string
}

export function TreeView({ node, onNavigate }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

	const nodeType = node.type
  const hasChildren = node?.nodes?.length > 0;
	const isComponent = nodeType === 'asset' && !hasChildren

	function handleToggleExpanded(){
		setIsExpanded(prev => !prev)
	}

	function makeNodeName(node: Node) {
		const isAsset = nodeType === 'asset' && hasChildren

		switch(true){
			case isComponent: 
				const isEnergyType = node.sensorType === 'energy'
				const isAlert = node.status === 'alert' 

				return (
					<NavLink to={onNavigate(node.id)} className={({ isActive }) => [styles.toggleTreeButton, isActive ? styles.active : undefined].join(' ')}>
						<ComponentIcon />
						{node.name}
						{isEnergyType 
							? <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.40167 7.72576H0.593342C0.360008 7.72576 0.187439 7.62125 0.0756332 7.41222C-0.0361724 7.20319 -0.0240196 7.00145 0.112092 6.80701L4.47251 0.536175C4.56973 0.400064 4.69612 0.305273 4.85168 0.2518C5.00723 0.198328 5.16765 0.200759 5.33293 0.259092C5.4982 0.317425 5.61973 0.419509 5.69751 0.565342C5.77529 0.711175 5.80445 0.866731 5.78501 1.03201L5.31834 4.80909H7.57876C7.83154 4.80909 8.00897 4.9209 8.11105 5.14451C8.21313 5.36812 8.18154 5.57715 8.01626 5.77159L3.21834 11.5174C3.1114 11.6438 2.98015 11.7265 2.82459 11.7653C2.66904 11.8042 2.51834 11.7896 2.37251 11.7216C2.22668 11.6535 2.11244 11.549 2.0298 11.4081C1.94716 11.2671 1.91556 11.114 1.93501 10.9487L2.40167 7.72576Z" fill={isAlert ? "#ED3833" : "#52C41A"}/>
								</svg>
							: <div className={styles.circleEnergy} data-status={node.status}/>
						}
					</NavLink>
				)
			case isAsset:
				return (
					<button className={styles.toggleTreeButton} tabIndex={-1}>
						<AssetIcon />
						{node.name}
					</button>
				)
			default:
				return (
					<button className={styles.toggleTreeButton} tabIndex={-1}>
						<LocationIcon />
						{node.name}
					</button>
				) 
		}
	}

  return (
    <div className={styles.container}>
      <button 
				className={styles.toggleTreeContainer} 
				onClick={handleToggleExpanded} 
				tabIndex={isComponent ? -1 : 0}
			>
        {hasChildren && (isExpanded ? '▼' : '▶')}
				{makeNodeName(node)}
      </button>
      {isExpanded && hasChildren && (
        <div>
          {node.nodes!.map((child) => (
            <TreeView key={child.id} node={child} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};

