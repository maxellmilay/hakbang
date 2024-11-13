import { OverlayView } from '@react-google-maps/api'

interface PropsInterface {
    position: {
        lat: number
        lng: number
    }
}

export const PulsatingMarker = (props: PropsInterface) => {
    const { position } = props

    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div className="pulse-marker" />
        </OverlayView>
    )
}
