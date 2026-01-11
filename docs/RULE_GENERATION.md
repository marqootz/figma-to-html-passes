# Rule Generation & Sequential Navigation

## Overview

The Figma to HTML plugin provides two powerful features for component set presentations:

1. **Rule Generation (Pass 4)**: Automatically generate event-driven rules for controlling video and Lottie playback
2. **Sequential Navigation**: Auto-generate keyboard navigation between slides (Key 1=Previous, Key 2=Next)

These features are useful for creating multi-screen installations and presentations where media elements need to play/stop as you navigate through slides.

## How It Works

### Component Sets as Presentations

- Each **Component Set** = A presentation
- Each **Variant** (component) = A slide
- Media elements in each slide are automatically detected
- Rules are generated to play media when a slide appears and stop when it disappears

### Generated Rules

For each variant containing media elements, the system generates:

1. **Play Rules**: When variant appears → Start playing videos/Lotties
2. **Stop Rules**: When variant disappears → Stop playing videos/Lotties

## Sequential Navigation Feature

### What It Does

When enabled, the exporter automatically adds keyboard navigation to your component set presentations:

- **Key "1"**: Navigate to previous slide (instant transition)
- **Key "2"**: Navigate to next slide (instant transition)
- **Sequential order**: Variants are navigated in the order they appear in the component set
- **Boundary behavior**: At first slide, "1" does nothing; at last slide, "2" does nothing

### How to Enable

1. In the plugin UI, check **"Auto-generate slide navigation (Key 1=Prev, 2=Next)"**
2. Click **"Export HTML"**
3. The generated HTML will include keyboard navigation
4. Open the HTML in a browser and press "1" or "2" to navigate

### Conflict Handling

The sequential navigation system **coexists with Figma reactions**, but with these considerations:

**What happens:**
- Pre-existing Figma reactions (including keyboard reactions) are **fully preserved**
- Sequential navigation adds a **global keyboard listener** for keys "1" and "2"
- If Figma reactions use keys "1" or "2", sequential navigation **will override them**
- The system **detects conflicts** and logs warnings in the browser console

**Recommendations:**
- ✅ **Use different keys** for Figma reactions (3, 4, 5, etc.)
- ✅ **Or disable sequential nav** if you have custom keyboard reactions
- ✅ **Check console warnings** - tells you if keys are conflicting

**Input Protection:**
- Sequential navigation is **disabled** when typing in input fields
- Won't interfere with text entry or forms

### Example

For a component set with 3 variants:
- **Slide 1** → Press "2" → **Slide 2** → Press "2" → **Slide 3**
- **Slide 3** → Press "1" → **Slide 2** → Press "1" → **Slide 1**

---

## Rule Generation Feature

## Usage

### 1. In Figma

Create your presentation structure:

```
📦 My Presentation (COMPONENT_SET)
├── 🎨 Slide 1 (COMPONENT)
│   ├── 🎬 [VIDEO] intro.mp4 (FRAME)
│   ├── ✨ [LOTTIE] spinner.json (FRAME)
│   └── 📝 Title Text (TEXT)
├── 🎨 Slide 2 (COMPONENT)
│   ├── 🎬 [VIDEO] demo.mp4 (FRAME)
│   └── 📝 Description (TEXT)
└── 🎨 Slide 3 (COMPONENT)
    └── 📝 Conclusion (TEXT)
```

### 2. Export Rules

1. Select the component set in Figma
2. Open the **Figma to HTML** plugin
3. Click **"Export Rules JSON"** button
4. Save the JSON file

### 3. Use the Rules

The generated JSON file is compatible with the `uxync-gdf-showroom` rule system. You can:

1. Open your `config/rules/rule-sets.json` file
2. Merge the generated rules into the `ruleSets` object
3. The rules will automatically trigger when navigating through variants

## Output Format

### Example Output

```json
{
  "categories": {
    "interaction": {
      "name": "Interaction Rules",
      "description": "Rules for user interactions between clients",
      "color": "#667eea"
    }
  },
  "ruleSets": {
    "custom-1760195817714": {
      "name": "my-presentation",
      "description": "Auto-generated rules for my-presentation.html",
      "category": "interaction",
      "project": "Unassigned",
      "tags": ["auto-generated", "figma-export"],
      "rules": [
        {
          "name": "play_video_[VIDEO] intro.mp4",
          "sourceHtml": "my-presentation.html",
          "sourceEvent": "figma_element_appeared",
          "sourceFigmaId": "1:2",
          "targetHtml": "my-presentation.html",
          "targetEvent": "play_video",
          "targetFigmaId": "1:3",
          "videoId": "video-1-3",
          "id": "1-2-1-3-play"
        },
        {
          "name": "stop_video_[VIDEO] intro.mp4",
          "sourceHtml": "my-presentation.html",
          "sourceEvent": "figma_element_disappeared",
          "sourceFigmaId": "1:2",
          "targetHtml": "my-presentation.html",
          "targetEvent": "stop_video",
          "targetFigmaId": "1:3",
          "videoId": "video-1-3",
          "id": "1-2-1-3-stop"
        }
      ],
      "variables": {},
      "isTemplate": false,
      "active": true
    }
  }
}
```

## Rule Structure

Each rule contains:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Descriptive name for the rule | `"play_video_[VIDEO] intro.mp4"` |
| `sourceHtml` | HTML file containing the trigger | `"my-presentation.html"` |
| `sourceEvent` | Event that triggers the rule | `"figma_element_appeared"` or `"figma_element_disappeared"` |
| `sourceFigmaId` | Figma ID of the variant (slide) | `"1:2"` |
| `targetHtml` | HTML file containing the target | `"my-presentation.html"` |
| `targetEvent` | Action to perform | `"play_video"`, `"stop_video"`, `"play_lottie"`, `"stop_lottie"` |
| `targetFigmaId` | Figma ID of the media element | `"1:3"` |
| `videoId` / `lottieId` | DOM ID of the media element | `"video-1-3"` |
| `id` | Unique rule identifier | `"1-2-1-3-play"` |

## Events

### Source Events

- **`figma_element_appeared`** - Triggered when a variant/slide becomes visible
- **`figma_element_disappeared`** - Triggered when a variant/slide becomes hidden

### Target Events

- **`play_video`** - Start playing a video element
- **`stop_video`** - Stop playing a video element
- **`play_lottie`** - Start playing a Lottie animation
- **`stop_lottie`** - Stop playing a Lottie animation

## Media Detection

The system automatically detects media elements by checking frame names:

- **Videos**: Frames named `[VIDEO] filename.mp4`
- **Lotties**: Frames named `[LOTTIE] filename.json`

These use the same naming convention as the main HTML export feature.

## Integration with uxync-gdf-showroom

The generated rules are designed to work with the `uxync-gdf-showroom` event system:

1. **Place HTML file** in the showroom's presentation directory
2. **Merge rules** into `config/rules/rule-sets.json`
3. **Navigation triggers** will automatically play/stop media as you move between slides

## Example Workflow

### In Figma:

1. Create component set: "Investor Presentation"
2. Create 3 variants: "Intro", "Demo", "Conclusion"
3. Add `[VIDEO] intro-clip.mp4` to "Intro" variant
4. Add `[LOTTIE] loading.json` to "Intro" variant
5. Add `[VIDEO] demo-clip.mp4` to "Demo" variant

### Export:

1. Select "Investor Presentation" component set
2. Click "Export HTML" → saves `investor-presentation.html`
3. Click "Export Rules JSON" → saves `investor-presentation-rules.json`

### Result:

- **6 rules** generated (3 play + 3 stop)
- Navigate to "Intro" → Plays intro video and loading animation
- Navigate to "Demo" → Stops intro media, plays demo video
- Navigate to "Conclusion" → Stops demo video

## Troubleshooting

### No rules generated

**Problem**: Rules array is empty

**Solutions**:
- Ensure your design has a COMPONENT_SET (not just a frame)
- Add frames named `[VIDEO]` or `[LOTTIE]` inside the variants
- Check the plugin console for detection logs

### Rules not triggering

**Problem**: Rules generated but media doesn't play

**Solutions**:
- Verify the HTML file has the video/Lottie elements with matching IDs
- Check that the `uxync-gdf-showroom` event system is running
- Verify the rule set is marked as `"active": true`

## Notes

- One rule set per HTML file
- Rules are scoped to the same HTML file (sourceHtml = targetHtml)
- Media IDs match the format: `video-{figmaId}` and `lottie-{figmaId}`
- Rules are auto-generated with unique IDs to prevent conflicts

