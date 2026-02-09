# Plan: Advanced Chart Format Support

## Problem Statement

Mermaid's `xychart-beta` directive has significant limitations:
1. **No logarithmic scales** - Cannot display log-log graphs
2. **No point annotations** - Cannot add labels/notes to specific data points
3. **No custom lines with labels** - Cannot add reference lines like "Throttled Bandwidth"
4. **No arrows** - Cannot point to specific elements
5. **Only line and bar charts** - No scatter plots, area charts, etc.

The user needs to visualize performance comparisons between deep (ResNet) and wide (MobileNet/EfficientNet) networks on edge devices, which requires these advanced features.

## Solution Architecture

### Approach: Hybrid Rendering with Chart.js Integration

Instead of trying to extend Mermaid's limited xychart capabilities, we'll implement a **dual-renderer architecture**:

1. **Mermaid** - Continues to handle all diagram types it excels at (flowcharts, sequence, ER, etc.)
2. **Chart.js** - Handles advanced chart types that Mermaid cannot support

### Why Chart.js?

| Library | Log Scales | Annotations | Customization | Bundle Size | Ease of Use |
|---------|------------|-------------|---------------|-------------|-------------|
| Chart.js | ✅ Native | ✅ Plugin | ✅ Excellent | ~200KB | ✅ High |
| D3.js | ✅ Native | ✅ Manual | ✅ Excellent | ~500KB | ⚠️ Complex |
| Plotly | ✅ Native | ✅ Native | ✅ Excellent | ~3MB | ✅ High |
| Vega-Lite | ✅ Native | ✅ Native | ⚠️ Moderate | ~500KB | ⚠️ DSL |

**Chart.js wins** for:
- Smaller bundle size (~200KB gzipped with plugins)
- Native logarithmic scale support
- Rich annotation plugin ecosystem
- Easy integration with React
- Familiar API for customization

## Implementation Phases

### Phase 1: Chart.js Integration (Core)
1. Install Chart.js and required plugins
2. Create ChartRenderer component
3. Add chart type detection in diagramSanitizer
4. Create custom DSL for advanced charts (simple JSON-like syntax)

### Phase 2: Hybrid Viewer
1. Update DiagramViewer to route to appropriate renderer
2. Add seamless fallback between renderers
3. Maintain consistent styling/theming across both

### Phase 3: AI Prompt Enhancement
1. Update Gemini system prompt to recognize when Chart.js is needed
2. Teach AI the new chart DSL syntax
3. Add examples of log-log graphs, annotations, etc.

### Phase 4: Polish & Testing
1. Add loading/error states for Chart.js
2. Export functionality for charts
3. Theme synchronization
4. Browser testing

## Custom Chart DSL Syntax

For Chart.js charts, we'll use a JSON-based format that's easy for AI to generate:

```chartjs
{
  "type": "line",
  "title": "ResNet vs MobileNet Performance",
  "scales": {
    "x": { "type": "logarithmic", "title": "Model Parameters (M)" },
    "y": { "type": "logarithmic", "title": "Inference Time (ms)" }
  },
  "datasets": [
    {
      "label": "ResNet Family",
      "data": [{"x": 11.7, "y": 24}, {"x": 25.6, "y": 45}, {"x": 44.5, "y": 78}],
      "color": "#8b5cf6"
    },
    {
      "label": "MobileNet Family", 
      "data": [{"x": 3.4, "y": 12}, {"x": 5.3, "y": 18}, {"x": 7.8, "y": 25}],
      "color": "#10b981"
    }
  ],
  "annotations": [
    {
      "type": "line",
      "value": 50,
      "orientation": "horizontal",
      "label": "Throttled Bandwidth",
      "color": "#ef4444",
      "style": "dashed"
    },
    {
      "type": "point",
      "x": 25.6,
      "y": 45,
      "label": "ResNet-50"
    }
  ]
}
```

## Risk Analysis

- **Low Risk**: Adding new dependency (Chart.js is stable and widely used)
- **Medium Risk**: AI prompt changes (need careful testing to ensure proper DSL generation)
- **Low Risk**: Rendering performance (Chart.js is optimized for canvas rendering)

## Files to Create/Modify

### New Files
- `src/lib/chartjs.ts` - Chart.js initialization and rendering
- `src/components/diagram/ChartRenderer.tsx` - React component for Chart.js
- `src/lib/chartDSL.ts` - Parser for the custom chart DSL

### Modified Files
- `src/lib/diagramSanitizer.ts` - Add chart type detection
- `src/components/diagram/DiagramViewer.tsx` - Route to appropriate renderer
- `src/lib/gemini.ts` - Update system prompt with Chart.js DSL
- `package.json` - Add Chart.js dependencies

---

## Superseded

Previous plan was for bug fixes related to explanation details, canvas rendering, and share links. That work has been completed.
