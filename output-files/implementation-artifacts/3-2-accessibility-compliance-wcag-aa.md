# Story 3.2: Accessibility Compliance (WCAG AA)

Status: ready-for-dev

## Story

As a **user with visual impairments or using assistive technology**,
I want **the interface to meet WCAG AA accessibility standards**,
So that **I can use screen readers and other assistive tools to participate in retrospectives**.

## Acceptance Criteria

**Given** I am using assistive technology
**When** I interact with the application
**Then** all content and functionality are accessible

**And** Color contrast meets standards (FR32, NFR17):
- Text: minimum 4.5:1 contrast
- Large text (18pt+): minimum 3:1
- Interactive elements: minimum 3:1
- No color-only information

**And** Semantic HTML structure (FR33, NFR18):
- Proper heading hierarchy (h1→h2→h3)
- Main landmark (<main>)
- Buttons use <button>, links use <a>
- Lists use <ul>/<ol>/<li>

**And** ARIA labels and attributes (FR34, NFR18):
- Icon-only buttons have aria-label
- Form inputs have labels
- Errors use aria-describedby
- Required fields: aria-required="true"

**And** Live regions for real-time updates (NFR18):
- New cards: aria-live="polite"
- Card edits: aria-live="polite"
- Connection changes: aria-live="assertive"

## Tasks / Subtasks

### Frontend

- [ ] Audit all color contrast with DevTools
- [ ] Add semantic HTML structure
- [ ] Add aria-labels to all buttons
- [ ] Add aria-live regions for updates
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Run Lighthouse accessibility audit

## Dev Notes

Use Lighthouse and axe DevTools for automated testing. Manual screen reader testing required.

```jsx
// Example aria-live region
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

## Dev Agent Record

### File List
_To be filled by dev agent_
