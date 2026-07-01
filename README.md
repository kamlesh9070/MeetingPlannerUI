# Meeting Planner UI

This is the Angular frontend for the Meeting Planner prototype.

## Setup

1. Install Node.js 18+ and npm.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:4200`.
 
## Backend integration

- By default the UI expects the backend API at `http://localhost:8080/api`.
- To change the backend URL, edit `src/environments/environment.ts` and `src/environments/environment.prod.ts` and update `apiBaseUrl`.
- Start the backend before using protected UI flows (signup/login, meeting creation, avatar uploads).

Example environment override:

```ts
export const environment = {
	production: false,
	apiBaseUrl: 'http://localhost:8080/api'
};
```

## Error handling

- The UI now parses structured API errors returned by the backend and surfaces useful messages and field-level details where available.


## What is included

- Basic Angular app scaffold with routing.
- Material UI shared module for form and layout components.
- Pages for `Login`, `Signup`, `Dashboard`, `Meetings`, and `Profile` etc.


## Notes

- The app is built to connect to a backend at `http://localhost:8080/api`.
- This is initial scaffolding only.
