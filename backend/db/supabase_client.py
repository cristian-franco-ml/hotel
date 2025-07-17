from datetime import date
from typing import List, Dict, Tuple

# Se asume que la instancia global 'supabase' está en backend_server.py
# Puedes importar supabase aquí si es global, o pasarla como argumento a las funciones.

def fetch_competitor_prices_for_range(supabase, start_date: date, end_date: date) -> List[Dict]:
    """
    Obtiene precios de la competencia para el rango de fechas dado.
    """
    response = (
        supabase.table("competitor_prices")
        .select("*")
        .gte("check_in_date", start_date.isoformat())
        .lte("check_in_date", end_date.isoformat())
        .execute()
    )
    if hasattr(response, 'error') and response.error:
        raise Exception(f"Error fetching competitor prices: {response.error}")
    return response.data if hasattr(response, 'data') else response

def fetch_detected_events_for_range(supabase, hotel_coords: Tuple[float, float], start_date: date, end_date: date, radius_km: int = 20) -> List[Dict]:
    """
    Obtiene eventos detectados cercanos al hotel para el rango de fechas dado.
    """
    response = (
        supabase.table("detected_events")
        .select("*")
        .gte("start_date", start_date.isoformat())
        .lte("end_date", end_date.isoformat())
        .execute()
    )
    if hasattr(response, 'error') and response.error:
        raise Exception(f"Error fetching detected events: {response.error}")
    lat, lon = hotel_coords
    filtered = []
    for event in (response.data if hasattr(response, 'data') else response):
        dist = event.get("distance_to_hotel_km")
        if dist is not None and dist <= radius_km:
            filtered.append(event)
    return filtered 