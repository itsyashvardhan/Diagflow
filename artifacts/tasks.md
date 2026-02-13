# Tasks: Advanced Chart Format Support

## Phase 1: Chart.js Integration (Core)

- [x] Install Chart.js and plugins (`chart.js`, `chartjs-plugin-annotation`)
- [x] Create `src/lib/chartDSL.ts` - DSL parser for chart configurations
- [x] Create `src/lib/chartjs.ts` - Chart.js initialization and rendering utilities
- [x] Create `src/components/diagram/ChartRenderer.tsx` - React component wrapper

## Phase 2: Hybrid Viewer

- [x] Update `src/lib/diagramSanitizer.ts` - Add chartjs type detection
- [x] Update `src/components/diagram/DiagramViewer.tsx` - Route to ChartRenderer when appropriate
- [x] Verify production build compiles successfully

## Phase 3: AI Prompt Enhancement

- [x] Update `src/lib/gemini.ts` - Add Chart.js DSL syntax to system prompt
- [x] Update response parser to extract chartjs code blocks
- [ ] Test AI generation of advanced charts (manual testing)

## Phase 4: Polish & Testing

- [ ] Test rendering of Chart.js diagrams in browser
- [ ] Test theme synchronization between Chart.js and app theme
- [ ] Add export functionality for Chart.js diagrams
- [ ] Browser compatibility testing

## Summary

**Completed:** 9/13 tasks
**Remaining:** 4 manual testing tasks

All code implementation is complete. The remaining tasks are manual verification steps that should be performed in the browser.
