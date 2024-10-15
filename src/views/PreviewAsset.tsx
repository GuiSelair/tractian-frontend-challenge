import { useParams } from "react-router-dom"

export function PreviewAssetPage() {
	const { assetId } = useParams<{ assetId: string }>()

	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>Preview asset ({assetId})</div>
	)
}
