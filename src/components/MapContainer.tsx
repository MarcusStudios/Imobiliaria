// src/components/MapContainer.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// CORREÇÃO: Mudamos de 'let' para 'const'
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// ... resto do código

interface MapProps {
  lat: number;
  lng: number;
  endereco: string;
}

export const PropertyMap = ({ lat, lng, endereco }: MapProps) => {
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "12px", overflow: "hidden", marginTop: "2rem" }}>
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{endereco}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};