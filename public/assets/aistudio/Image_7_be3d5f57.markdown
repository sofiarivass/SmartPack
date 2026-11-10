---
name: SmartPack Precision Logistics
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f26'
  on-tertiary-container: '#0090a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  metric-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-telemetry:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system establishes a hyper-lucid, airy, and high-trust digital environment built specifically for real-time IoT cargo telematics and supply chain management. Designed for operations directors, fleet managers, and warehouse controllers who oversee high-velocity, high-value asset flows, the interface shifts the sensory experience from industrial clutter to architectural clarity.

The visual style combines **Corporate Modernism** with an **Ultra-Minimalist** sensory cadence:
- Expansive, breathing negative space that treats whitespace as an active organizational substrate rather than blank background.
- Crisp structural cadence: deep oceanic navy provides architectural weight, authoritative metrics, and rigorous visual order.
- Hyper-focused bio-luminescent accents: focused teals and cyans operate as intentional focal points, indicating sensor fidelity, live telemetry pulses, device pings, and definitive actionable paths.
- Unapologetic data clarity: micro-detail legibility, disciplined data hierarchies, and calm, distraction-free surfaces that mitigate cognitive fatigue during mission-critical oversight.

## Colors
The system relies on an airy, high-contrast, clinical palette engineered to maximize clarity across complex logistic boards.

- **Primary (`#0F172A` - Slate Navy):** The structural anchor. Used for primary headlines, structural frames, key metrics, high-impact buttons, and high-priority states. Conveys stability, authority, and institutional security.
- **Secondary (`#0D9488` - Deep Teal):** The kinetic operational signal. Deployed for primary interactive states, confirmed hardware telemetry, battery health, and verified pack states.
- **Tertiary (`#06B6D4` - Cyber Cyan):** The telematics pulse accent. Reserved for real-time sensor pings, geofence breaches, active streaming waves, and precision badges.
- **Neutral (`#64748B` - Slate Neutral):** The dampening shade. Used for secondary labels, passive metrics, chart grids, and structural outlines.

### Supporting Canvas & Semantic Tokens
- **Canvas Base:** `#F8FAFC` (Slate 50) delivers an ultra-clean, clinical ground plane that eliminates visual noise.
- **Surface Elevation (Cards/Panels):** `#FFFFFF` (Pure White) surfaces rest on the canvas base with distinct, razor-sharp edge contrast.
- **Subtle Stroke/Dividers:** `#E2E8F0` (Slate 200) creates structural boundaries without adding optical weight.
- **IoT Signal States:**
  - *Telemetry Active / Normal:* `#0D9488`
  - *Alert / Temperature Variance:* `#F59E0B` (Amber 500)
  - *Critical Breach / Lost Link:* `#EF4444` (Rose 500)
  - *Standby / Sleep:* `#94A3B8` (Slate 400)

## Typography
The system uses a high-efficiency dual typographic stack:

- **Headlines and Metric Displays:** Built on **Plus Jakarta Sans**, offering geometric clarity, subtle modern roundings, and strong horizontal rhythm. High-impact telemetry values leverage tabular metrics and tight negative letter-spacing to emphasize authority and speed.
- **Body, Structural Tables, and Telemetry Labels:** Powered by **Inter**, chosen for its tall x-height, neutral letterforms, and legibility at sub-12px sizes in high-density data grids.

### Implementation Guidelines
- **Tabular Numerics:** All dynamic counters, timestamps, coordinates, sensor readings, and cargo weights must implement OpenType tabular figures (`font-feature-settings: "tnum"`).
- **Uppercase Data Labels:** Sub-labels (e.g., `DEV-EUI`, `LAST PING`, `TEMP`) use `label-sm` with 4% letter-spacing and `uppercase` text transform for instant scannability on dense monitoring dashboards.

## Layout & Spacing
The layout balances rigorous mathematical structure with airy negative space. It prevents the dense visual fatigue common to logistics dashboards by enforcing strict macro-whitespace around operational zones.

### Grid Framework
- **Desktop (>= 1280px):** 12-column responsive grid with a fluid maximum width of 1600px. Margins are fixed at `2rem` (`space-xl`), gutters at `1.5rem` (`space-lg`). Side navigation panels are pinned at 280px with collapsible utility states.
- **Tablet (768px - 1279px):** 8-column layout. Gutter scales down to `1.25rem`, outer margins to `1.5rem`. Secondary sensor maps dock below primary pack lists.
- **Mobile (< 768px):** 4-column layout. Gutter shrinks to `1rem`, margin to `1rem`. Panels stack vertically into full-width card structures.

### Layout Principles
- **Airy Breathing Chambers:** Metric widgets, asset track cards, and telemetry charts feature generous internal breathing padding (`space-lg` to `space-xl`), keeping data clusters clearly separated.
- **High-Density Data Pockets:** While the macroscopic layout is spacious and open, microscopic telemetry tables (such as payload breakdown and live sensor rows) adopt strict vertical rhythms via `space-xs` and `space-sm` for quick visual scanning.

## Elevation & Depth
The system bypasses heavy skeuomorphism and muddy drop shadows in favor of a crisp **Low-Contrast Outlines & Ambient Diffusion** model. Depth is established through subtle luminosity shifts, razor-thin boundary borders, and near-invisible ambient penumbras.

### Depth Hierarchy
1. **Level 0 (Canvas Base):** Flat `#F8FAFC`. Zero elevation, providing an uncluttered, distraction-free environment for operational monitoring.
2. **Level 1 (Surface Cards & Structural Containers):** Pure `#FFFFFF` background bound by a crisp 1px solid `#E2E8F0` border. A faint, tinted ambient shadow (`0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`) provides clean separation from the canvas.
3. **Level 2 (Hover States, Interactive Cards, Active Filter Flyouts):** Maintained `#FFFFFF` surface with an elevated ambient drop shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.025)`, bordered by `#CBD5E1`.
4. **Level 3 (Modals, Overlays, Floating Geofence Drawers):** `#FFFFFF` paired with an elevated ambient drop shadow (`0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`), set over an airy backdrop scrim (`rgba(15, 23, 42, 0.2)` with `backdrop-filter: blur(4px)`).

### Precision Glows
Interactive telemetry pulses and real-time active indicators use targeted soft glows (`0 0 12px rgba(13, 148, 136, 0.25)`) instead of heavy mechanical outlines to communicate live connections.

## Shapes
The system uses **Roundedness Level 2**, balancing clean architectural lines with subtle, organic corner radii to keep the interface friendly, precise, and approachable.

- **Micro Components (Pills, Status Dots, Badges):** Fully rounded pill geometry (`rounded-full` / 9999px) to clearly distinguish metadata from structural containers.
- **Inputs, Form Controls & Action Buttons:** Standard 8px (`0.5rem`) corner radius to create dependable, tactile interactive targets.
- **Cards, Panels & Modal Shells:** Elevated to 12px–16px (`rounded-lg` to `rounded-xl`), creating soft visual containers that retain crisp geometric definition against the soft `#F8FAFC` canvas.

## Components

### Buttons
- **Primary Action (Dispatch, Confirm, Export):** Solid `#0F172A` deep navy fill, `#FFFFFF` crisp text, 8px radius, subtle hover lift to `#1E293B`. Focus state reveals a 2px offset ring in `#0D9488`.
- **Secondary Telemetry Action (Ping Sensor, Calibrate):** `#FFFFFF` surface with a 1px `#E2E8F0` border, `#0F172A` text. Hover transitions to `#F8FAFC` with a `#0D9488` border.
- **Live IoT Action (Active Sync):** Solid `#0D9488` with `#FFFFFF` text, paired with a faint cyan glow (`box-shadow: 0 0 10px rgba(13, 148, 136, 0.35)`).

### Telemetry Badges & Chips
- Fully rounded pills (`padding: 4px 10px`, `label-sm`).
- **Connected / Tracking:** Background `#CCFBF1` (Teal 100), text `#0F766E`, paired with a live 6px `#0D9488` pulsing dot.
- **Alert / Geofence Breach:** Background `#FEF3C7` (Amber 100), text `#B45309`.
- **Offline / Sleep Mode:** Background `#F1F5F9`, text `#64748B`.

### Cards & Telemetry Containers
- Background `#FFFFFF`, 12px radius, 1px solid `#E2E8F0`, ambient level-1 shadow.
- Ample inner padding (`space-lg` / 24px).
- Upper metadata header separated by a 1px subtle divider or marked by expansive vertical whitespace.
- Top-level metric value rendered in `metric-xl` (`#0F172A`) paired with a muted secondary trend label in `body-sm`.

### Form Inputs & Search Filters
- Input frame: 40px height, 8px radius, `#FFFFFF` fill, 1px `#E2E8F0` border, `14px` text (`#0F172A`).
- Placeholder text in `#94A3B8`.
- Focus state switches smoothly to a 1px border of `#0D9488` with a soft `0 0 0 3px rgba(13, 148, 136, 0.12)` ambient halo.

### Checkboxes & Radios
- Checkboxes: 18x18px, 4px corner radius, border 1.5px solid `#CBD5E1`. On select: `#0F172A` background with crisp white check mark icon.
- Radios: 18x18px, circular, with a centered `#0D9488` active indicator dot on selection.

### Tables & Data Grids
- Clean, uncluttered layout: no alternating zebra stripes. Visual order is maintained through generous whitespace (`padding: 14px 16px` per cell) and fine `1px solid #F1F5F9` bottom row borders.
- Header row uses uppercase `label-sm` with `#64748B` text, anchored on a `#F8FAFC` base surface.

### Specialty Components: IoT Pack Health Widget
- Compact card housing battery health, temperature, and shock-sensor gauges.
- Displays telemetry via dynamic mini sparklines (`stroke: #0D9488`, `stroke-width: 2`) overlaid on an airy grid with real-time ping updates.