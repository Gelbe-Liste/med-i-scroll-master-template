# Production-Konfiguration fuer med.i.scroll v6.6

- Vercel Production statt Preview als Zielumgebung.
- Production-Variablen enthalten nun `VITE_POSTHOG_ENABLED=true` (Uebertragung nach eigener gueltiger Einwilligung und Token-Konfiguration).
- `deployment_environment=production`; Preview-Tracking standardmaessig aus.
- Quellcode von Piano, PostHog und medizinische Inhalte gegenüber v1.4.1 unveraendert.
- WICHTIG: Ohne Consent-Integration weiterhin keine Analytics-Events. Das ist gewollt.
- Wenn bereits v1.4.1 deployed ist, sind **nur die Vercel-Production-Variablen und ein Redeploy** notwendig. Kein erneuter Quellcode-Upload erforderlich.
