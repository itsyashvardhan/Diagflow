# Diagflow TODO

> Last updated: 2025-12-06

## 🟢 Quick Wins 

### 5. Keyboard Shortcut Hints
**Priority:** P2 | **Effort:** Low
- Show tooltips with shortcuts on hover (e.g., "Undo (Ctrl+Z)")
- Add keyboard shortcut cheatsheet in Help modal

### 11. Undo/Redo Visual Feedback
**Priority:** P3 | **Effort:** Low
- Show toast notification when undoing/redoing
- Brief highlight animation on diagram change

### 12. Diagram Title/Labels
**Priority:** P2 | **Effort:** Low
- Allow users to name their diagrams
- Display title in history modal for better organization

---

## 🟡 Medium Effort (4-8 hours each)

### 6. Mobile Responsive Layout
**Priority:** P1 | **Effort:** Medium
- Collapsible chat panel on mobile (<768px)
- Bottom sheet or drawer for chat on small screens
- Touch-friendly diagram controls
- Swipe gestures for zoom

### 8. Diagram Zoom to Fit
**Priority:** P2 | **Effort:** Low
- Auto-calculate zoom level to fit entire diagram in viewport
- "Fit to screen" button in zoom controls

### 9. Prompt Templates/Quick Actions
**Priority:** P2 | **Effort:** Medium
- Floating action buttons: "Add database", "Add auth flow", "Add API layer"
- One-click modifications to existing diagrams

### 10. Code Syntax Highlighting in Code View
**Priority:** P2 | **Effort:** Medium
- Use `prism-react-renderer` or `shiki` for Mermaid syntax highlighting
- Line numbers in code editor
- Copy line on click

---

## 🟠 Feature Additions 

### 13. Share Diagram Link
**Priority:** P1 | **Effort:** Medium
- Encode diagram code as base64 URL param
- `/app?d=<encoded>` for shareable links
- "Copy share link" button in export modal
- No backend required

### 14. Multiple Diagram Sessions/Tabs
**Priority:** P1 | **Effort:** Medium
- Tab UI for multiple active diagrams
- Independent chat history per tab
- Tab persistence in localStorage

### 15. Diagram Templates Gallery
**Priority:** P2 | **Effort:** Medium
- Pre-built templates:
  - Microservices Architecture
  - CI/CD Pipeline
  - Authentication Flow
  - Database Schema
  - API Gateway Pattern
  - Event-Driven Architecture

### 16. Real-time Collaboration (View Only)
**Priority:** P3 | **Effort:** High
- WebSocket-based live viewing
- Presenter mode with cursor sharing
- QR code for quick join

### 17. Diagram Diff View
**Priority:** P3 | **Effort:** Medium
- Visual side-by-side comparison between history entries
- Highlight added/removed nodes

### 18. Custom Mermaid Themes
**Priority:** P3 | **Effort:** Medium
- Theme editor with color pickers
- Save/load custom themes
- Export theme as JSON

---

## 🔴 Major Features (3+ days each)

### 19. Backend API Proxy
**Priority:** P1 | **Effort:** High
- Node.js/Bun API server or Edge Functions (Vercel/Cloudflare)
- Protect API keys server-side
- Rate limiting per IP/user
- Usage analytics dashboard
- Tech options: Hono, Express, Cloudflare Workers

### 20. User Accounts & Cloud Sync
**Priority:** P1 | **Effort:** High
- Authentication: Firebase Auth, Supabase, or Clerk
- Diagram storage in cloud database
- Cross-device sync
- Diagram sharing between users

### 21. PDF Export with Layout Options
**Priority:** P2 | **Effort:** Medium
- Multi-page PDF generation
- Header/footer with title and timestamp
- Page size options (A4, Letter, etc.)
- Use `jspdf` or `@react-pdf/renderer`

### 22. Voice Input
**Priority:** P3 | **Effort:** Medium
- "Create a flowchart for..." via Web Speech API
- Microphone button in chat input
- Real-time transcription display

### 23. Diagram Minimap
**Priority:** P2 | **Effort:** Medium
- Small preview panel for navigating large diagrams
- Click to pan to area
- Highlight current viewport

### 24. Version Control (Git-like)
**Priority:** P3 | **Effort:** High
- Named versions/tags for diagrams
- Branch and merge concepts
- Diff between any two versions

### 25. Embed Widget
**Priority:** P2 | **Effort:** Medium
- Generate embeddable `<iframe>` code
- Customizable size and theme
- "Powered by Diagflow" badge (optional)

### 26. Plugin System
**Priority:** P4 | **Effort:** Very High
- Architecture for custom diagram types
- Allow custom AI providers (OpenAI, Anthropic)
- Plugin marketplace concept

### 27. Offline Mode (PWA)
**Priority:** P2 | **Effort:** Medium
- Service worker for offline access
- Cache diagrams for offline viewing/editing
- Sync when back online
- Add to home screen support

### 28. AI Diagram Improvement Suggestions
**Priority:** P1 | **Effort:** Medium
- Proactive suggestions: "Add a load balancer between X and Y"
- "Optimize" button to auto-improve diagrams
- Best practices hints

### 29. Mermaid Security Hardening
**Priority:** P2 | **Effort:** Low
- Change `securityLevel: "loose"` to `"strict"`
- Test compatibility with existing diagrams
- Document any breaking changes

### 30. Accessibility (a11y) Audit
**Priority:** P2 | **Effort:** Medium
- Keyboard navigation for all controls
- ARIA labels on interactive elements
- Screen reader support for diagram descriptions
- High contrast mode option

---

## 📊 Priority Legend

| Priority | Meaning |
|----------|---------|
| **P1** | Critical - Do next |
| **P2** | Important - Plan soon |
| **P3** | Nice to have |
| **P4** | Future consideration |

---

## 🎯 Suggested Sprint Plan

### Sprint 1 (This Week)
- [ ] Mobile Responsive Layout (#6)
- [ ] Share Diagram Link (#13)

### Sprint 2 (Next Week)
- [ ] Diagram Templates Gallery (#15)
- [ ] AI Diagram Suggestions (#28)

### Sprint 3 (Week After)
- [ ] Backend API Proxy (#19)
- [ ] Multiple Diagram Tabs (#14)

### Backlog
- User Accounts (#20)
- PDF Export (#21)
- PWA/Offline (#27)
- Voice Input (#22)
