import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { Search, MapPin, Navigation, X, CheckCircle2 } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={DefaultIcon} />
  )
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({ isOpen, onClose, onSave, initialLocation }) {
  const [position, setPosition] = useState(
    initialLocation?.lat && initialLocation?.lng
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : null
  );
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Auto-detect current location
  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        await reverseGeocode(newPos.lat, newPos.lng);
        setLoading(false);
      }, (error) => {
        console.error(error);
        alert("Gagal mendapatkan lokasi GPS.");
        setLoading(false);
      });
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
      if (data.length === 0) {
        alert("Lokasi tidak ditemukan.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectSearchResult = (item) => {
    const newPos = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    setPosition(newPos);
    setAddress(item.display_name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (!position) return;
    onSave(position.lat, position.lng, address);
    onClose();
  };

  // Komponen Marker yang juga mengupdate alamat saat diklik/digeser
  function InteractiveMarker({ position, setPosition }) {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={DefaultIcon} />
    )
  }

  // Perbaikan untuk ubin peta yang pecah (broken tiles)
  function MapResizer() {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }, [map]);
    return null;
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
      <div className={`bg-white w-full shadow-2xl flex flex-col transition-all duration-300 ${showMap ? 'max-w-4xl h-full md:h-[85vh] md:max-h-[800px]' : 'max-w-2xl h-auto max-h-[90vh]'} md:rounded-[2.5rem] overflow-hidden`}>

        {/* Header - Ringkas */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {showMap ? 'Pilih dari Peta' : 'Lokasi Lahan'}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
              {showMap ? 'Geser peta untuk menentukan titik akurat' : 'Tentukan titik lokasi lahan Anda'}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search & Location Bar - Ringkas */}
        {!showMap && (
          <div className="p-5 flex flex-col gap-3 shrink-0 bg-white z-[1100]">
          <div className="relative">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Cari desa atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-emerald-500 focus:ring-0 transition-all outline-none"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-emerald-700 transition-colors">Cari</button>
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-[200px] overflow-y-auto z-[1200]">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSearchResult(item)}
                    className="w-full text-left p-3.5 hover:bg-emerald-50 border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3"
                  >
                    <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-700">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCurrentLocation}
              type="button"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors active:scale-[0.98]"
            >
              {loading ? 'Memuat...' : <><Navigation size={14} /> Gunakan GPS Saya</>}
            </button>
            
            {!showMap && (
              <button
                onClick={() => setShowMap(true)}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors active:scale-[0.98]"
              >
                <MapPin size={14} /> Pilih dari Peta
              </button>
            )}
          </div>

          {!showMap && address && (
            <div className="mt-1 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 items-center animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Lokasi Terpilih</p>
                <p className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-2">
                  {address}
                </p>
              </div>
            </div>
          )}
          </div>
        )}

        {/* Map Area - Fleksibel */}
        {showMap && (
          <div className="flex-1 relative bg-slate-200 min-h-[50vh] md:min-h-0 overflow-hidden border-t border-slate-100 animate-fade-in">
            <MapContainer
              center={position && position.lat ? position : [-6.2088, 106.8456]}
              zoom={13}
              style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <InteractiveMarker position={position} setPosition={setPosition} />
              <ChangeView center={position} />
              <MapResizer />
            </MapContainer>

            <div className="absolute bottom-4 left-4 right-4 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50">
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin size={14} />
                </div>
                <p className="text-[10px] font-bold text-slate-700 leading-tight line-clamp-2">
                  {address || 'Geser peta untuk memilih lokasi...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions - Terkunci di bawah */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
          <button
            onClick={showMap ? () => setShowMap(false) : onClose}
            type="button"
            className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-100"
          >
            {showMap ? 'Kembali' : 'Batal'}
          </button>
          <button
            onClick={handleSave}
            type="button"
            disabled={!position}
            className="flex-[2] py-3.5 bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:shadow-none hover:bg-emerald-700 disabled:hover:bg-slate-300"
          >
            <CheckCircle2 size={16} /> Simpan Lokasi Lahan
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
