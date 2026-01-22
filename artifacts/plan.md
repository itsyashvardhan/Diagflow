# Plan: Bug Fixes - Explanation Details, Canvas Rendering, and Share Links

## Issues Identified

### 1. Explanation Details Hidden at All Times
**Problem**: The explanation/details section in ChatMessage is collapsed by default for assistant messages, but the initial state logic is incorrect.
- Line 105 in `ChatMessage.tsx`: `useState(!isUser && message.content.length < 300)` 
- This means: if it's an assistant message AND content is short (< 300 chars), it's expanded. Otherwise collapsed.
- **Issue**: Most AI responses are longer than 300 chars, so they're always collapsed by default.

**Solution**: Change the default state to always expand assistant messages initially, or make it configurable.

### 2. Canvas Not Rendering Image Instantly
**Problem**: Potential caching or rendering delay issues with Mermaid diagrams.
- No console errors reported, suggesting the issue is likely in the rendering pipeline or state updates.
- Possible causes:
  - Mermaid initialization timing
  - React state update batching
  - SVG insertion delay
  - Missing force re-render after diagram code changes

**Solution**: 
- Add explicit cache-busting for Mermaid renders
- Ensure immediate state updates trigger re-renders
- Check if `useEffect` dependencies are correctly set up in DiagramViewer
- Verify the render promise is properly awaited

### 3. Share Link Not Working on Production
**Problem**: Share links (`/d/:shareId`) fail in production but work locally.
- Likely causes:
  - Supabase environment variables not set in production
  - CORS issues with Supabase
  - Routing configuration in production build
  - Error handling swallowing the actual error

**Solution**:
- Add better error logging to identify the root cause
- Verify Supabase credentials are properly configured in production
- Check if the route is properly handled by the production server
- Add fallback error messages that surface the actual issue

## Implementation Phases

### Phase 1: Fix Explanation Details Visibility
- Update ChatMessage default expanded state logic
- Test with various message lengths

### Phase 2: Fix Canvas Rendering Delays
- Add cache-busting to Mermaid render calls
- Ensure proper re-render triggers
- Add loading state feedback

### Phase 3: Fix Share Links in Production
- Add comprehensive error logging
- Verify environment variable configuration
- Test share link flow end-to-end
- Add user-friendly error messages

## Risk Analysis
- **Low Risk**: Explanation details fix (UI-only change)
- **Medium Risk**: Canvas rendering (could affect performance if not done carefully)
- **Medium Risk**: Share links (requires production environment verification)
