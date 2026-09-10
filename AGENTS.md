# ReadyRig Prototype Guide

## Project Overview

ReadyRig is a standalone, browser-only design and workflow prototype for fire department incident reporting. It demonstrates the path from simulated CAD receipt through firefighter completion, officer review, approval, and a future NERIS handoff. It must never connect to production ReadyRig services, real department data, CAD, NERIS, Supabase, or other external APIs.

## Technology

- TanStack Start with React 19 and TypeScript
- TanStack Router file-based routing
- Tailwind CSS 4 tooling with a custom CSS design system
- Lucide React icons
- Netlify static deployment
- Browser `localStorage` for disposable prototype state only

## Key Files

- `src/routes/index.tsx`: Complete prototype workflow, mock data, report state, validation, conditional forms, review, correction, and approval states.
- `src/routes/__root.tsx`: Document shell, metadata, and favicon configuration.
- `src/styles.css`: Responsive industrial fire-service visual system and mobile touch behavior.
- `public/readyrig-mark.svg`: Standalone product favicon.
- `netlify.toml`: Netlify build and publish configuration.

## Architecture

The application intentionally uses one route and a small screen state machine rather than a backend or multi-route data architecture. This keeps the prototype easy to reset, share, and evaluate. The primary screens are `dashboard`, `report`, `officer`, and `final`; report steps are controlled separately within the report screen.

Incident-specific questions are defined in the `detailSchemas` configuration. Add or revise prototype questions there rather than branching UI markup throughout the application. Mock units and personnel are configuration arrays and should remain easy to replace with dynamic department data in a future production system.

## Conventions

- Keep all incident and personnel data clearly fictional.
- Preserve large touch targets and mobile-first layouts.
- Use immutable React state updates.
- Keep required-field rules centralized in `getMissingFields`.
- Do not add external data connections, authentication, server functions, or production identifiers.
- Treat `localStorage` as disposable prototype convenience, not durable or secure storage.
- Use descriptive component and variable names; avoid one-letter identifiers.

## Local Development

Install dependencies with `pnpm install` and run `pnpm dev`. The standard Netlify-emulated command is `netlify dev --port 8889`.
