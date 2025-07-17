from datetime import date, timedelta, datetime
from typing import List, Dict, Tuple
from backend.db.supabase_client import fetch_competitor_prices_for_range, fetch_detected_events_for_range

# Configuración heurística para el MVP
COMPETITOR_UNDERCUT_PCT = 0.05  # 5% por debajo del promedio de competencia
EVENT_IMPACT_PCT = {
    "High": 0.15,    # +15%
    "Medium": 0.08,  # +8%
    "Low": 0.02      # +2%
}
BASE_PRICES = {     # Precios base por tipo de habitación (puedes ajustar)
    "R1": 1200.0,   # Standard King
    "R2": 1800.0,   # Deluxe Suite
    # ...
}

def get_price_recommendations(
    supabase,
    hotel_id: str,
    hotel_coords: Tuple[float, float],
    own_room_types: Dict[str, str],
    days_in_advance: int = 60
) -> List[Dict]:
    """
    Genera recomendaciones de precios para los próximos days_in_advance días.
    Aplica reglas heurísticas sobre competencia y eventos.
    """
    today = date.today()
    end_date = today + timedelta(days=days_in_advance)
    # 1. Traer datos de competencia y eventos
    competitor_prices = fetch_competitor_prices_for_range(supabase, today, end_date)
    detected_events = fetch_detected_events_for_range(supabase, hotel_coords, today, end_date, radius_km=20)

    recommendations = []
    for room_name, room_type_id in own_room_types.items():
        for day_offset in range(days_in_advance):
            target_date = today + timedelta(days=day_offset)
            # --- Regla 1: Reacción a Competencia ---
            comp_prices = [
                p for p in competitor_prices
                if p["check_in_date"] == target_date.isoformat()
                # Aquí podrías mapear room_type_raw a room_type_id si tienes lógica
            ]
            if comp_prices:
                avg_price = sum(p["price_per_night"] for p in comp_prices if p["price_per_night"]) / len(comp_prices)
                min_price = min(p["price_per_night"] for p in comp_prices if p["price_per_night"])
                # Estrategia: ser 5% más barato que el promedio, pero nunca menos que el mínimo
                recommended_price = max(min_price, avg_price * (1 - COMPETITOR_UNDERCUT_PCT))
                reasoning = f"Ajuste por competencia: promedio={avg_price:.2f}, mínimo={min_price:.2f}."
                recommendation_strength = 0.8
            else:
                # --- Regla 3: Precio base ---
                recommended_price = BASE_PRICES.get(room_type_id, 1000.0)
                reasoning = "Precio base por falta de datos de competencia."
                recommendation_strength = 0.5

            # --- Regla 2: Impacto de eventos ---
            events_today = [
                e for e in detected_events
                if e["start_date"] <= target_date.isoformat() <= e["end_date"]
            ]
            if events_today:
                # Aplica el mayor impacto de los eventos del día
                max_impact = max(EVENT_IMPACT_PCT.get(e["estimated_impact"], 0) for e in events_today)
                if max_impact > 0:
                    old_price = recommended_price
                    recommended_price = recommended_price * (1 + max_impact)
                    reasoning += f" Incremento por evento(s) de impacto {', '.join(set(e['estimated_impact'] for e in events_today))}."
                    recommendation_strength = 1.0 if max_impact >= 0.1 else 0.9

            # --- Regla 4: Mapeo de habitaciones ---
            # En el MVP, se asume que el mapeo es directo por own_room_types

            recommendations.append({
                "hotel_id": hotel_id,
                "room_type_id": room_type_id,
                "target_date": target_date.isoformat(),
                "recommended_price": round(recommended_price, 2),
                "current_price": None,  # Si tienes integración PMS, pon el precio actual aquí
                "reasoning": reasoning,
                "recommendation_strength": recommendation_strength,
                "status": "Pending Review",
                "generated_at": datetime.now().isoformat(),
                "applied_at": None,
                "user_id": None
            })
    return recommendations 