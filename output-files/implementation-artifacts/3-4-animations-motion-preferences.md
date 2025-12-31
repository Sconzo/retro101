# Story 3.4: Animations & Motion Preferences

Status: ready-for-dev

## Story

As a **user sensitive to motion or using reduced motion settings**,
I want **subtle animations that enhance the experience but respect my motion preferences**,
So that **I can use the application comfortably without motion sickness or distraction**.

## Acceptance Criteria

**Given** animations are part of the user experience
**When** I interact with the interface
**Then** animations are subtle, purposeful, and respect my preferences

**And** Card entrance animations:
- Fade in + scale (200ms)
- opacity 0→1, scale 0.95→1
- Easing: ease-out

**And** Hover transitions:
- Smooth 100ms transitions
- background-color, border-color, transform

**And** Modal animations:
- Fade + slide (150ms)
- Close reverses open

**And** Delete animations:
- Fade out 200ms
- Smooth space collapse

**And** Loading states:
- Skeleton screens/shimmer
- Smooth spinner loops

**And** Reduced motion support:
- @media (prefers-reduced-motion: reduce)
- Disable non-essential animations
- Instant transitions for critical actions

## Tasks / Subtasks

### Frontend

- [ ] Add Tailwind transition utilities
- [ ] Implement card fade-in animation
- [ ] Add modal slide-in animation
- [ ] Add delete fade-out
- [ ] Add @media (prefers-reduced-motion)
- [ ] Test with OS reduced motion enabled

## Dev Notes

Use Tailwind animate and transition utilities.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```jsx
<div className="transition-all duration-200 ease-out opacity-0 scale-95 data-[show=true]:opacity-100 data-[show=true]:scale-100">
```

## Dev Agent Record

### File List
_To be filled by dev agent_
