/**
 * src/utils/weatherApi.js
 * Utility untuk mengambil data cuaca dari OpenWeatherMap.
 */

const API_KEY = 'b5b2c8353e1a853c89e662ab847c6abb'; // Ganti dengan API Key Anda
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Ambil data cuaca saat ini
 */
export const fetchWeather = async (lat, lon) => {
  if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
    console.warn("[SiDaun] API Key OpenWeatherMap belum di-set.");
    return null;
  }
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenWeatherMap Error:", errData.message);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal mengambil data cuaca:", error);
    return null;
  }
};

/**
 * Ambil ramalan cuaca 5 hari (setiap 3 jam)
 */
export const fetchForecast = async (lat, lon) => {
  if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') return null;
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal mengambil ramalan cuaca:", error);
    return null;
  }
};

/**
 * Logika Rekomendasi Agronomis Cabai berbasis Cuaca
 */
export const getChiliAdvice = (weather) => {
  if (!weather || !weather.main || !weather.weather) return [];

  const { main, weather: wInfo, rain } = weather;
  const temp = main.temp;
  const humidity = main.humidity;
  const condition = wInfo[0]?.main?.toLowerCase() || '';
  const rainVol = rain ? (rain['1h'] || rain['3h'] || 0) : 0;

  const advices = [];

  // 1. Logika Kelembapan (Penyakit Jamur)
  if (humidity > 85) {
    advices.push({
      type: 'warning',
      title: 'Waspada Jamur',
      text: 'Kelembapan sangat tinggi. Waspada penyakit Bercak Daun dan Antraknosa. Pastikan drainase lancar.'
    });
  }

  // 2. Logika Suhu Panas (Hama Thrips/Kutu)
  if (temp > 32) {
    advices.push({
      type: 'info',
      title: 'Suhu Panas',
      text: 'Udara panas memicu perkembangan Thrips. Cek bagian bawah daun secara rutin.'
    });
  }

  // 3. Logika Hujan (Pemupukan)
  if (condition.includes('rain') || rainVol > 2) {
    advices.push({
      type: 'danger',
      title: 'Tunda Pemupukan',
      text: 'Hujan terdeteksi. Tunda pemberian pupuk akar agar tidak terbilas air hujan.'
    });
  } else if (temp < 30 && humidity < 70) {
    advices.push({
      type: 'success',
      title: 'Waktu Memupuk',
      text: 'Cuaca stabil. Waktu yang baik untuk memberikan pupuk susulan atau nutrisi daun.'
    });
  }

  // 4. Logika Penyiraman
  if (rainVol > 5) {
    advices.push({
      type: 'info',
      title: 'Hemat Air',
      text: 'Curah hujan cukup tinggi. Anda bisa menunda penyiraman rutin hari ini.'
    });
  }

  return advices;
};

/**
 * Analisis ramalan hujan untuk beberapa hari ke depan
 */
export const analyzeRainForecast = (forecastData) => {
  if (!forecastData || !forecastData.list) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Cari kapan hujan pertama kali muncul
  const firstRain = forecastData.list.find(item => 
    item.weather[0].main.toLowerCase().includes('rain')
  );

  if (!firstRain) return { status: 'no_rain', message: 'Cerah/Berawan 5 hari ke depan' };

  const rainTime = new Date(firstRain.dt * 1000);
  const rainDate = new Date(rainTime.getFullYear(), rainTime.getMonth(), rainTime.getDate());
  
  const diffDays = Math.round((rainDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { status: 'rainy', day: 'Hari Ini', message: 'Hujan diprediksi hari ini' };
  if (diffDays === 1) return { status: 'rainy', day: 'Besok', message: 'Hujan diprediksi besok' };
  if (diffDays === 2) return { status: 'rainy', day: 'Lusa', message: 'Hujan diprediksi lusa (2 hari lagi)' };
  
  return { status: 'rainy', day: `${diffDays} hari lagi`, message: `Hujan diprediksi ${diffDays} hari lagi` };
};
