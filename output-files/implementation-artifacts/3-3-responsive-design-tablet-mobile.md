# Story 3.3: Responsive Design (Tablet & Mobile)

Status: ready-for-dev

## Story

As a **user on tablet or mobile device**,
I want **the interface to adapt to my screen size with touch-friendly interactions**,
So that **I can participate in retrospectives from any device**.

## Acceptance Criteria

**Given** I am using a tablet or mobile device
**When** I access the application
**Then** the layout adapts appropriately to my screen size

**And** Breakpoints defined (FR35, NFR19):
- Mobile: 320px-767px
- Tablet: 768px-1023px
- Desktop: ≥1024px
- No horizontal scrolling

**And** Mobile layout (320px+):
- Categories stack vertically
- Cards full-width
- Touch targets ≥44x44px
- Readable fonts without zoom

**And** Tablet layout (768px-1023px):
- 2 column categories
- Collapsible participant list
- Landscape/portrait both work

**And** Desktop layout (≥1024px):
- Multi-column categories
- Sidebar participant list
- Optimal screen use

**And** Touch interactions:
- All buttons ≥44x44px
- Adequate spacing
- No hover-only interactions

## Tasks / Subtasks

### Frontend

- [ ] Add Tailwind responsive classes
- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Ensure touch targets ≥44px
- [ ] Test landscape/portrait
- [ ] Use Chrome DevTools device emulation

## Dev Notes

Use Tailwind responsive utilities: sm:, md:, lg:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {categories.map(category => <CategoryColumn key={category.id} />)}
</div>
```

## Dev Agent Record

### File List
_To be filled by dev agent_
