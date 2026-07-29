/**
 * @file src/components/MapView.tsx
 * @description Módulo de Integração com API de Mapas (Leaflet / OpenStreetMap) para o Bairro Mubungo e Rio Dande
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ShieldCheck, AlertOctagon, Layers, Compass, Eye } from 'lucide-react';
import { SensorNode, Language } from '../types';
import { getSensors } from '../services/storage';
import { getTranslation } from '../data/translations';

interface MapViewProps {
  currentLang: Language;
}

export const MapView: React.FC<MapViewProps> = ({ currentLang }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);
  const [showAssemblyPoints, setShowAssemblyPoints] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Coordenadas Centrais do Bairro Mubungo / Caxito / Bengo
  const BENGO_CENTER: [number, number] = [-8.5815, 13.6680];

  useEffect(() => {
    setSensors(getSensors());

    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Inicialização do Mapa Leaflet
    const map = L.map(mapContainerRef.current, {
      center: BENGO_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // Camada Base OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | SABM Bengo',
      maxZoom: 19,
    }).addTo(map);

    // Adiciona controlo de zoom no canto superior direito
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualiza Marcadores e Zonas no Mapa quando os sensores mudarem
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Marcadores de Sensores Hardware (ESP32 e Arduino Uno)
    sensors.forEach((s) => {
      const isAlert = s.status === 'alerta';

      // Ícone do Marcador customizado com HTML
      const customIcon = L.divIcon({
        className: 'custom-sensor-marker',
        html: `
          <div style="
            background-color: ${isAlert ? '#ef4444' : '#3b82f6'};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
          ">
            ${s.hardwareType === 'ESP32' ? 'E32' : 'ARD'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(map);

      // Popup informativo para cada sensor no Bengo
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #1e293b; font-size: 13px;">${s.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${s.location}</p>
          <div style="background: #f1f5f9; padding: 6px; border-radius: 6px; font-size: 11px;">
            <div><strong>Nível Atual:</strong> ${s.currentWaterLevelMeters.toFixed(2)}m</div>
            <div><strong>Hardware:</strong> ${s.hardwareType}</div>
            <div><strong>Estado:</strong> <span style="color: ${isAlert ? '#dc2626' : '#16a34a'}; font-weight: bold;">${s.status.toUpperCase()}</span></div>
          </div>
        </div>
      `);
    });

    // Adiciona Polígonos de Risco de Inundação do Bairro Mubungo
    if (showRiskZones) {
      // Zona Vermelha (Margem do Rio Dande - Risco Elevado)
      const redZone = L.polygon(
        [
          [-8.5770, 13.6620],
          [-8.5800, 13.6670],
          [-8.5840, 13.6720],
          [-8.5860, 13.6700],
          [-8.5810, 13.6640],
        ],
        {
          color: '#ef4444',
          fillColor: '#f87171',
          fillOpacity: 0.35,
          weight: 2,
        }
      ).addTo(map);
      redZone.bindTooltip('Zona Vermelha: Risco Crítico de Cheia (Bairro Mubungo Baixo)', { permanent: false });

      // Zona Amarela (Atenção - Inundação Secundária)
      const yellowZone = L.polygon(
        [
          [-8.5750, 13.6600],
          [-8.5810, 13.6690],
          [-8.5880, 13.6750],
          [-8.5900, 13.6680],
          [-8.5820, 13.6600],
        ],
        {
          color: '#eab308',
          fillColor: '#fde047',
          fillOpacity: 0.2,
          weight: 1.5,
        }
      ).addTo(map);
      yellowZone.bindTooltip('Zona Amarela: Área de Transição e Risco Moderado', { permanent: false });
    }

    // Pontos de Encontro Seguros (Assembly Points) para Evacuação
    if (showAssemblyPoints) {
      const assemblyPoints = [
        { name: 'Ponto de Encontro 1: Escola Primária do Mubungo', lat: -8.5760, lng: 13.6750 },
        { name: 'Ponto de Encontro 2: Campo Polidesportivo de Caxito', lat: -8.5890, lng: 13.6610 },
      ];

      assemblyPoints.forEach((pt) => {
        const shieldIcon = L.divIcon({
          className: 'assembly-marker',
          html: `
            <div style="
              background-color: #16a34a;
              width: 28px;
              height: 28px;
              border-radius: 8px;
              border: 2px solid white;
              box-shadow: 0 3px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
            ">
              🛡️
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([pt.lat, pt.lng], { icon: shieldIcon })
          .addTo(map)
          .bindPopup(`<strong>${pt.name}</strong><br/>Zona Elevada e Segura contra cheias.`);
      });
    }
  }, [sensors, showRiskZones, showAssemblyPoints]);

  // Obter Geolocalização do Dispositivo do Utilizador no Bengo
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(coords, 16);

            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background-color: #a855f7;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 12px #a855f7;
                "></div>
              `,
              iconSize: [24, 24],
            });

            L.marker(coords, { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('Sua Posição Atual')
              .openPopup();
          }
        },
        () => {
          alert('Não foi possível obter a sua localização exata no Bengo.');
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas do Mapa */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-lg">
        <div>
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Mapa Hídrico & Rotas de Evacuação do Mubungo (API de Mapas)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mapeamento em tempo real da bacia do Rio Dande, sensores hardware e pontos de abrigo no Bengo
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Alternar Zonas de Risco */}
          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showRiskZones
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Zonas de Risco
          </button>

          {/* Alternar Pontos de Encontro */}
          <button
            onClick={() => setShowAssemblyPoints(!showAssemblyPoints)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showAssemblyPoints
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Pontos de Abrigo
          </button>

          {/* Centrar no Utilizador */}
          <button
            onClick={handleLocateUser}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow"
          >
            <Compass className="w-3.5 h-3.5" />
            Minha Posição
          </button>
        </div>
      </div>

      {/* Contentor do Mapa Leaflet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[520px] z-10"
          style={{ background: '#0f172a' }}
        />

        {/* Legenda Flutuante do Mapa */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 max-w-xs text-white">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
            Legenda Hídrica do Bengo
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block border border-white" />
            <span className="text-slate-300">Estação ESP32 / Arduino (Normal)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-white animate-pulse" />
            <span className="text-slate-300">Sensor em Estado de Alerta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500/50 rounded inline-block border border-red-500" />
            <span className="text-slate-300">Zona Vermelha (Inundação Crítica)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🛡️</span>
            <span className="text-slate-300">Ponto de Encontro / Abrigo Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
