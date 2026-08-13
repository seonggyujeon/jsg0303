# Ocean Log application architecture

Ocean Log is a mobile-first App Router shell around the existing Busan coastal recommendation product. This stage adds navigation, onboarding and stable extension boundaries; it does not replace the existing recommendation algorithm, beach catalog or API routes.

## Directory map

```text
app/
  page.tsx                 first-run onboarding entry
  layout.tsx               root providers and metadata
  (main)/                  guarded MainApp route group
    home/                  Home tab route
    places/                Places tab route
    recommend/             Recommend tab route
    saved/                 Saved tab route
    settings/              Settings tab route
components/
  app/                     global provider composition
  common/                  brand and module-slot UI
  layout/                  MainApp and feature-screen shells
  navigation/              safe-area bottom navigation
features/
  onboarding/              download and language screens
  home/ places/ recommend/ saved/ settings/
  auth/                    interface-only authentication boundary
lib/
  app-flow/                download → language → main state and storage
  navigation/              tab definitions
  i18n/                    locales, options and shared copy
types/                     shared contracts only
data/                      placeholder module-slot definitions
```

## App flow

The versioned `AppFlowProvider` owns only device-local onboarding state. On a first visit, `/` runs the replaceable initial-data preparation adapter, opens language selection, persists the chosen locale, then replaces browser history with `/home`. Main routes guard against direct entry before onboarding is complete.

## Feature boundaries

Every bottom tab has an independent route and screen component. Screens currently render one `ContentModuleSlot`; future modules can replace that slot without changing navigation or onboarding. Shared contracts must not import feature UI. Provider SDKs and external API response shapes belong behind adapters rather than in components.

## Existing product boundary

The former recommendation experience remains exported as `LegacyRecommendationPage` from `app/page.tsx`, while the existing `app/api`, `db` and marine adapter files remain intact. This keeps the current product available for incremental migration into the new Places and Recommend feature modules.

## State and persistence

- App-flow and locale preferences: versioned localStorage adapter.
- Feature state: owned inside each feature when implemented.
- Remote data and caching: future adapters replace `prepareInitialAppData` and feature-specific ports.
- Authentication: `AuthPort` only; no login behavior is enabled.

## Responsive layout

The shell starts at phone width, honors top and bottom safe-area insets, and keeps the five-tab navigation fixed. At wider widths the app becomes a centered reading surface without changing route or component behavior. Navigation uses App Router links, so normal browser back/forward behavior remains available.
