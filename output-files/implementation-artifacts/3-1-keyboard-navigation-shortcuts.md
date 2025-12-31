# Story 3.1: Keyboard Navigation & Shortcuts

Status: ready-for-dev

## Story

As a **keyboard user**,
I want **complete keyboard navigation with shortcuts for common actions**,
So that **I can participate in retrospectives efficiently without using a mouse**.

## Acceptance Criteria

**Given** I am using the application with only my keyboard
**When** I navigate through the interface
**Then** all interactive elements are accessible via keyboard

**And** Basic keyboard navigation works (FR31):
- Tab/Shift+Tab cycles through elements
- Enter activates buttons/links
- Escape closes modals
- Arrow keys navigate lists/cards
- Focus order follows visual layout

**And** Category shortcuts work:
- Alt+1-5 focuses categories 1-5
- Focus moves to "Add Card" button

**And** Card management shortcuts:
- Enter to edit, Delete to remove
- Escape to cancel, Ctrl+Enter to save
- Arrow keys navigate cards

**And** Modal keyboard behavior:
- Focus trapped within modal
- Escape closes modal
- Focus returns to trigger

**And** Focus indicators visible (NFR16):
- Clear 2px focus ring
- High contrast
- Visible on all backgrounds

## Tasks / Subtasks

### Frontend

- [ ] Add focus styles to all interactive elements
- [ ] Implement Tab key navigation order
- [ ] Add Alt+1-5 keyboard shortcuts
- [ ] Add card keyboard shortcuts (Enter, Delete)
- [ ] Implement focus trap in modals
- [ ] Test keyboard-only navigation

## Dev Notes

Use Tailwind focus utilities and implement keyboard event handlers.

```typescript
// Add keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      focusCategory(parseInt(e.key) - 1);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Dev Agent Record

### File List
_To be filled by dev agent_
