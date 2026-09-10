# ReadyRig Incident Reporting Prototype

ReadyRig is a standalone, clickable workflow prototype for the Hickory Creek & Pleasure Heights Fire Department. It lets firefighters and officers evaluate a proposed incident-report experience from simulated CAD receipt through report completion, officer approval, and a clearly labeled future NERIS submission step.

This project is for design feedback only. It uses fictional mock data and does not connect to ReadyRig production systems, CentralSquare/CAD, NERIS, Supabase, a database, or any external API.

## Included Workflow

- Incident dashboard with a simulated CAD event and report queues
- Six-step firefighter report with progressive navigation
- Multi-unit response selection and editable response times
- Incident-type-specific questions for fire, EMS, rescue, wildland, hazmat, and other calls
- Personnel selection with optional unit assignments
- Narrative entry, required-field validation, and review summary
- Officer approval and return-for-correction loop
- Final ReadyRig Complete screen with a non-functional NERIS placeholder
- Responsive layouts for iPhone, iPad, and desktop
- Disposable browser-local draft state and a demo reset control

## Technology

- TanStack Start
- React 19 and TypeScript
- Tailwind CSS tooling with custom responsive CSS
- Lucide React icons
- Netlify hosting

## Run Locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. For Netlify local emulation, use:

```bash
netlify dev --port 8889
```

## Demo Path

Open `TEST-26-00124`, work through all six steps, select units and personnel, complete the incident-specific details, and submit for officer review. The officer screen supports both returning the report with a note and approving it. Approval opens the final ReadyRig/NERIS placeholder status.

Use **Reset Demo Scenario** on the final screen to return the prototype to its initial state.
