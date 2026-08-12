# External API adapters

Only providers whose official documentation and response structure were verified are represented here. The application does not contain placeholder URLs or fabricated API keys.

## Open-Meteo Weather API

- Official documentation: <https://open-meteo.com/en/docs>
- Adapter: `lib/adapters/open-meteo.ts`
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Requested current fields: `temperature_2m`, `precipitation`, `wind_speed_10m`
- Parsed response path: `current.{time,interval,temperature_2m,precipitation,wind_speed_10m}`
- Authentication: none for the documented non-commercial API access used by this prototype

The adapter validates that the response has a `current` object and that every requested value is a finite number before converting it into the application's normalized condition model.

## Open-Meteo Marine Weather API

- Official documentation: <https://open-meteo.com/en/docs/marine-weather-api>
- Adapter: `lib/adapters/open-meteo.ts`
- Endpoint: `https://marine-api.open-meteo.com/v1/marine`
- Requested current fields: `wave_height`, `sea_surface_temperature`
- Parsed response path: `current.{time,interval,wave_height,sea_surface_temperature}`
- Authentication: none for the documented non-commercial API access used by this prototype

Open-Meteo documents that marine grid-cell accuracy is limited near coasts and that the data is not suitable for navigation. The recommendation engine therefore treats it as forecast input, not a maritime safety guarantee.

## Korea Tourism Organization TourAPI 4.0

- Korean service: <https://www.data.go.kr/data/15101578/openapi.do>
- English service: <https://www.data.go.kr/data/15101753/openapi.do>
- Japanese service: <https://www.data.go.kr/data/15101760/openapi.do>
- Simplified Chinese service: <https://www.data.go.kr/data/15101764/openapi.do>
- Adapter: `lib/adapters/tour-api.ts`
- Operation: `locationBasedList2`
- Parsed response paths:
  - result code: `response.header.resultCode`
  - result message: `response.header.resultMsg`
  - place items: `response.body.items.item`

The adapter selects the documented language service (`KorService2`, `EngService2`, `JpnService2`, or `ChsService2`) and sends the documented location-based request parameters. It requires a real `TOUR_API_SERVICE_KEY` obtained from the Public Data Portal. With no key, `/api/places?provider=tour-api` returns HTTP 503 and the relevant official documentation URL; it never substitutes a made-up key or endpoint.

Copy `.env.example` to a local environment file and insert an issued key only in that untracked local file or in the hosting provider's secret configuration.

## Marine activity availability

No verified external provider for real-time Busan marine-activity inventory, schedules, or booking availability is configured. `/api/activities` therefore exposes the curated D1 catalog and labels its source accordingly. A future provider can implement the shared contracts in `lib/adapters/contracts.ts` after its official endpoint, authentication method, and response schema are verified.

## Runtime provider registry

`GET /api/providers` reports every configured provider, official documentation URL, authentication requirement, and parsed response path. This makes it possible for the client and operators to distinguish live external data from curated or fallback data.
