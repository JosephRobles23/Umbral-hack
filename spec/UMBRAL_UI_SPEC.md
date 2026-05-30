# Umbral — UI/UX Design Specification

> **Target**: Claude Design  
> **Version**: 1.0  
> **Date**: 2026-05-30  
> **Stack**: Next.js 15 (App Router) + React 19, deployed locally  
> **Branding**: Anthropic/Claude visual identity  

---

## 1. Brand Identity

Umbral adopts the **Anthropic/Claude** design language — warm, minimal, intentionally calm. The product is a development governance framework that embeds inside a developer's workflow. It should feel like a natural extension of Claude's ecosystem.

### 1.1 Brand Pillars

| Pillar | Expression |
|--------|-----------|
| **Warm Intelligence** | Cream backgrounds, rounded corners, soft shadows — never cold or clinical |
| **Structured Clarity** | Clear hierarchy, generous whitespace, information density without clutter |
| **Developer Trust** | Monospace accents for code/data, terminal-native feel where appropriate |
| **Calm Governance** | Subtle status indicators, no aggressive reds unless something truly fails |

### 1.2 Logo & Mark

- **Wordmark**: "Umbral" in Styrene A Web Medium, tracked at -0.02em
- **Icon**: Stylized shield with an inner lattice pattern (represents governance layers)
- **Usage**: Wordmark in the sidebar header; icon alone as favicon and mobile touch icon
- **Clearspace**: Minimum 8px around the mark in all directions

---

## 2. Color System

Direct adoption of Anthropic's color palette with Umbral-specific semantic mapping.

### 2.1 Core Palette

```
BACKGROUND SCALE (warm neutrals)
┌─────────────────────────────────────────────────────┐
│  bg-base       #F5F0E8   Main canvas (light mode)   │
│  bg-surface    #EDE8DD   Cards, panels, dropdowns    │
│  bg-elevated   #E6E0D4   Hover states, active cards  │
│  bg-muted      #D9D2C5   Disabled fields, dividers   │
│  bg-inverse    #1A1915   Dark surfaces, terminal bg   │
│  bg-overlay    #2C2B26   Modals, overlays on dark     │
└─────────────────────────────────────────────────────┘

TEXT SCALE
┌─────────────────────────────────────────────────────┐
│  text-primary    #1A1A1A   Headlines, body text       │
│  text-secondary  #6B6560   Descriptions, labels       │
│  text-tertiary   #9B9590   Timestamps, hints          │
│  text-inverse    #F5F0E8   Text on dark backgrounds   │
│  text-disabled   #C5BFB5   Disabled labels            │
└─────────────────────────────────────────────────────┘

ACCENT (Anthropic signature)
┌─────────────────────────────────────────────────────┐
│  accent-primary    #DA7756   Primary CTA, links,      │
│                               Claude avatar accent     │
│  accent-hover      #C4674A   Hover state for primary   │
│  accent-pressed    #B05A40   Active/pressed state      │
│  accent-subtle     #F5E6DE   Light accent background   │
│  accent-text       #B85C3A   Accent-colored text       │
└─────────────────────────────────────────────────────┘

SEMANTIC COLORS
┌─────────────────────────────────────────────────────┐
│  success          #2D7D46   Aligned, passing gates     │
│  success-subtle   #E8F5E9   Success background         │
│  warning          #C17E2F   Override, cognitive debt    │
│  warning-subtle   #FFF3E0   Warning background         │
│  error            #C13A31   Blocked, failed gates       │
│  error-subtle     #FDECEA   Error background           │
│  info             #3B6FCA   Informational, in-progress  │
│  info-subtle      #E3EDFB   Info background            │
└─────────────────────────────────────────────────────┘

LAYER COLORS (C4 model visualization)
┌─────────────────────────────────────────────────────┐
│  layer-system     #6366F1   L5 - System context        │
│  layer-container  #0EA5E9   L4 - API/BFF containers    │
│  layer-component  #10B981   L2/L3 - Components         │
│  layer-code       #DA7756   L1 - Code (uses accent)    │
└─────────────────────────────────────────────────────┘

COGNITIVE LEVEL COLORS (EDE complexity)
┌─────────────────────────────────────────────────────┐
│  level-explorer   #0EA5E9   Low complexity, learning   │
│  level-navigator  #8B5CF6   Medium complexity          │
│  level-anchor     #DA7756   High complexity (accent)   │
└─────────────────────────────────────────────────────┘
```

### 2.2 Dark Mode (Terminal Context Only)

The terminal view uses a dedicated dark palette. All other views are light-mode only (matching claude.ai).

```
TERMINAL DARK PALETTE
┌─────────────────────────────────────────────────────┐
│  term-bg          #1A1915   Terminal background        │
│  term-surface     #252420   Terminal cards/panels      │
│  term-border      #3A3832   Borders in terminal view   │
│  term-text        #E8E4DD   Terminal foreground        │
│  term-cursor      #DA7756   Cursor (accent color)      │
│  term-selection   rgba(218, 119, 86, 0.25)             │
└─────────────────────────────────────────────────────┘
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| **Display** | Styrene A Web | `'Styrene A Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Page titles, sidebar brand |
| **Body** | Inter | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All body text, labels, descriptions |
| **Mono** | IBM Plex Mono | `'IBM Plex Mono', 'SF Mono', 'Cascadia Code', 'Consolas', monospace` | Code, terminal, EDE IDs, data values |

### 3.2 Type Scale

```
DISPLAY
  display-lg    32px / 38px line-height / -0.02em tracking / Styrene Medium
  display-md    24px / 30px / -0.02em / Styrene Medium
  display-sm    20px / 26px / -0.01em / Styrene Medium

HEADING
  heading-lg    18px / 24px / -0.01em / Inter SemiBold (600)
  heading-md    16px / 22px / -0.01em / Inter SemiBold (600)
  heading-sm    14px / 20px / -0.005em / Inter SemiBold (600)

BODY
  body-lg       16px / 24px / normal / Inter Regular (400)
  body-md       14px / 20px / normal / Inter Regular (400)
  body-sm       13px / 18px / normal / Inter Regular (400)

LABEL
  label-lg      14px / 20px / normal / Inter Medium (500)
  label-md      13px / 18px / normal / Inter Medium (500)
  label-sm      12px / 16px / 0.01em / Inter Medium (500)

MONO
  mono-lg       14px / 20px / normal / IBM Plex Mono Regular (400)
  mono-md       13px / 18px / normal / IBM Plex Mono Regular (400)
  mono-sm       12px / 16px / normal / IBM Plex Mono Regular (400)
  mono-xs       11px / 14px / normal / IBM Plex Mono Regular (400)

CAPTION
  caption       12px / 16px / normal / Inter Regular (400)
  overline      11px / 14px / 0.06em uppercase / Inter SemiBold (600)
```

---

## 4. Spacing & Grid

### 4.1 Spacing Scale (px)

```
0    0px
1    4px
2    8px
3    12px
4    16px
5    20px
6    24px
7    32px
8    40px
9    48px
10   64px
11   80px
12   96px
```

### 4.2 Layout Grid

- **Max content width**: 1280px
- **Sidebar width**: 260px (fixed)
- **Content area**: fluid, `calc(100vw - 260px)`, max 1020px with auto margins
- **Gutter**: 24px between columns
- **Page padding**: 40px top, 32px horizontal (content area)
- **Card grid**: CSS Grid, `repeat(auto-fill, minmax(340px, 1fr))`, gap 20px

### 4.3 Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| `sm` | 640px | Sidebar collapses to icon-only (48px) |
| `md` | 768px | Cards stack single column |
| `lg` | 1024px | Full sidebar, 2-column card grid |
| `xl` | 1280px | Max content width applies |

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button
```
┌──────────────────────────────┐
│       Launch Terminal        │
└──────────────────────────────┘

Specs:
  Background:     #DA7756 (accent-primary)
  Text:           #FFFFFF
  Font:           label-md (Inter Medium 13px)
  Padding:        10px 20px
  Border-radius:  8px
  Border:         none
  Min-width:      120px
  Height:         40px

States:
  :hover          bg #C4674A, cursor pointer
  :active         bg #B05A40, transform scale(0.98)
  :disabled       bg #D9D2C5, text #9B9590, cursor not-allowed
  :focus-visible  outline: 2px solid #DA7756, offset 2px

Interaction:
  - On click: fires associated action
  - Loading state: text replaced with spinner (16px) + "Loading..."
  - Spinner: border-based CSS spinner, 2px solid, accent color
```

#### Secondary Button
```
┌──────────────────────────────┐
│         Grill Me             │
└──────────────────────────────┘

Specs:
  Background:     transparent
  Text:           #1A1A1A
  Font:           label-md
  Padding:        10px 20px
  Border-radius:  8px
  Border:         1px solid #D9D2C5
  Height:         40px

States:
  :hover          bg #EDE8DD, border-color #C5BFB5
  :active         bg #E6E0D4
  :disabled       border-color #E6E0D4, text #C5BFB5
```

#### Ghost Button
```
Specs:
  Background:     transparent
  Text:           #6B6560
  Font:           label-sm
  Padding:        6px 12px
  Border-radius:  6px
  Border:         none

States:
  :hover          bg #EDE8DD, text #1A1A1A
  :active         bg #E6E0D4
```

#### Danger Button
```
Specs:
  Background:     transparent
  Text:           #C13A31
  Font:           label-md
  Padding:        10px 20px
  Border-radius:  8px
  Border:         1px solid #C13A31

States:
  :hover          bg #FDECEA
  :active         bg #C13A31, text #FFFFFF
```

#### Icon Button
```
Specs:
  Size:           36px × 36px
  Border-radius:  8px
  Background:     transparent
  Icon:           20px, color #6B6560
  Padding:        8px

States:
  :hover          bg #EDE8DD, icon-color #1A1A1A
  :active         bg #E6E0D4
```

### 5.2 Inputs

#### Text Input
```
┌──────────────────────────────────────────┐
│ Label                                    │
│ ┌──────────────────────────────────────┐ │
│ │ Placeholder text                     │ │
│ └──────────────────────────────────────┘ │
│ Helper text or error message             │
└──────────────────────────────────────────┘

Specs:
  Label:          label-sm (Inter Medium 12px), color #6B6560, margin-bottom 6px
  Input height:   40px
  Padding:        10px 12px
  Background:     #FFFFFF
  Border:         1px solid #D9D2C5
  Border-radius:  8px
  Font:           body-md (Inter 14px)
  Color:          #1A1A1A
  Placeholder:    #9B9590

States:
  :hover          border-color #C5BFB5
  :focus          border-color #DA7756, box-shadow: 0 0 0 3px rgba(218, 119, 86, 0.15)
  :error          border-color #C13A31, box-shadow: 0 0 0 3px rgba(193, 58, 49, 0.10)
  :disabled       bg #F5F0E8, border-color #E6E0D4, text #C5BFB5

Interaction:
  - On focus: border transitions to accent color (150ms ease)
  - Error state: helper text turns #C13A31, error icon appears at input right edge
  - Required fields: asterisk (*) after label in #C13A31
```

#### Select / Dropdown
```
┌──────────────────────────────────────────┐
│ Shell                                    │
│ ┌────────────────────────────────── ▾ ┐  │
│ │ Claude Code                          │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

Dropdown menu (open state):
  ┌──────────────────────────────────────┐
  │ Claude Code              ✓          │  ← selected, bg accent-subtle
  │ PowerShell                          │
  │ CMD                                 │
  └──────────────────────────────────────┘

Specs:
  Same as text input with chevron-down icon (16px) at right edge
  Dropdown menu:
    Background:     #FFFFFF
    Border:         1px solid #D9D2C5
    Border-radius:  8px
    Box-shadow:     0 4px 12px rgba(26, 26, 26, 0.08)
    Item padding:   10px 12px
    Item hover bg:  #F5F0E8
    Selected bg:    #F5E6DE (accent-subtle)
    Selected check: ✓ icon in #DA7756 at right
    Max height:     240px, overflow-y auto
    Animation:      fade-in + translateY(-4px), 150ms ease-out

Interaction:
  - Click input: opens dropdown below, chevron rotates 180°
  - Click option: selects, closes dropdown
  - Click outside: closes dropdown
  - Keyboard: ArrowUp/Down to navigate, Enter to select, Escape to close
```

#### Textarea
```
Specs:
  Same border/color treatment as text input
  Min-height:     80px
  Resize:         vertical only
  Padding:        12px
  Font:           body-md

Interaction:
  - Auto-grow: textarea expands as content grows, up to max-height 200px
  - Character count (optional): shown at bottom-right in caption style
```

### 5.3 Cards

#### EDE Card (Operative)
```
┌──────────────────────────────────────────────┐
│                                              │
│  ┌────┐  NAVIGATOR                           │
│  │ T2 │  Persistence Layer                   │
│  └────┘  EDE-000                             │
│                                              │
│  "Use SQLite via better-sqlite3 for          │
│   local-first persistence with zero          │
│   external dependencies."                    │
│                                              │
│  ┌──────────┐  ┌─────┐                       │
│  │ ACCEPTED │  │ v1  │                       │
│  └──────────┘  └─────┘                       │
│                                              │
└──────────────────────────────────────────────┘

Specs:
  Container:
    Background:     #FFFFFF
    Border:         1px solid #E6E0D4
    Border-radius:  12px
    Padding:        24px
    Width:          100% (grid-determined)
    Min-height:     auto
    Box-shadow:     0 1px 3px rgba(26, 26, 26, 0.04)

  Left accent:
    4px left border in cognitive-level color (explorer/navigator/anchor)

  Complexity badge (circle):
    Size:           40px × 40px
    Border-radius:  50%
    Background:     cognitive-level color
    Text:           #FFFFFF, mono-md, bold
    Format:         "T{tier}" (T1, T2, T3)

  Cognitive level:
    Font:           overline (11px uppercase, 0.06em tracking)
    Color:          cognitive-level color

  Title:
    Font:           heading-md (Inter SemiBold 16px)
    Color:          text-primary

  EDE ID:
    Font:           mono-sm (IBM Plex Mono 12px)
    Color:          text-tertiary

  Decision text:
    Font:           body-md (Inter 14px)
    Color:          text-secondary
    Max-lines:      3 (overflow: ellipsis with "…")

  Status badge:
    ACCEPTED:       bg success-subtle, text success, border 1px success
    PROPOSED:       bg info-subtle, text info, border 1px info
    DEPRECATED:     bg #F5F0E8, text text-tertiary, border 1px #D9D2C5
    All badges:     label-sm, padding 4px 10px, border-radius 20px (pill)

  Version badge:
    Background:     #F5F0E8
    Text:           text-tertiary
    Font:           mono-xs
    Padding:        4px 8px
    Border-radius:  20px

States:
  :hover          box-shadow: 0 4px 12px rgba(26, 26, 26, 0.08), translateY(-1px)
  :active         transform: none, box-shadow returns to default

Interaction:
  - On click: navigates to /operatives/{edeId} detail view
  - Hover: subtle lift effect (150ms ease)
  - Card is a <Link> wrapping the entire container
```

#### Metric Card (Dashboard)
```
┌──────────────────────────┐
│  CDR Score               │
│                          │
│  0.15                    │
│  ▼ trending down         │
│                          │
│  ████████░░  78%         │
└──────────────────────────┘

Specs:
  Container:
    Background:     #FFFFFF
    Border:         1px solid #E6E0D4
    Border-radius:  12px
    Padding:        20px
    Min-width:      200px
    Box-shadow:     0 1px 3px rgba(26, 26, 26, 0.04)

  Label:
    Font:           label-sm
    Color:          text-secondary

  Value:
    Font:           display-md (Styrene Medium 24px)
    Color:          text-primary

  Trend indicator:
    Font:           caption
    Color:          success (#2D7D46 for down/good) or warning (#C17E2F for up/bad)
    Icon:           12px arrow (▼ or ▲) before text

  Progress bar (optional):
    Height:         6px
    Border-radius:  3px
    Background:     #E6E0D4 (track)
    Fill:           accent-primary or semantic color
    Animation:      width transition 300ms ease

Interaction:
  - Hover: no specific interaction (informational)
  - Progress bar animates on mount (0 → current value, 600ms ease-out)
```

### 5.4 Status Indicators

#### Status Dot
```
●  Connected     → #2D7D46 (success)
●  In Progress   → #3B6FCA (info)
●  Warning       → #C17E2F (warning)
●  Disconnected  → #C13A31 (error)
●  Idle          → #D9D2C5 (muted)

Specs:
  Size:           8px × 8px
  Border-radius:  50%
  Background:     semantic color
  Animation:      pulse animation for "connecting" state
                  @keyframes pulse {
                    0%, 100% { opacity: 1 }
                    50% { opacity: 0.4 }
                  }
                  duration: 1.5s, infinite

Layout:
  Always paired with label text (label-sm), gap 6px, align-items center
```

#### Badge (Pill)
```
┌─────────────┐
│  ACCEPTED   │
└─────────────┘

Variants:
  success:    bg success-subtle,  text success,  border 1px success
  warning:    bg warning-subtle,  text warning,  border 1px warning
  error:      bg error-subtle,    text error,    border 1px error
  info:       bg info-subtle,     text info,     border 1px info
  neutral:    bg #F5F0E8,         text #6B6560,  border 1px #D9D2C5

Specs:
  Font:           label-sm (Inter Medium 12px, 0.01em tracking)
  Padding:        4px 10px
  Border-radius:  20px (full pill)
  Text-transform: uppercase (for status badges only)
  White-space:    nowrap
```

#### Progress Bar
```
████████████░░░░░░░░  Score: 65/70

Specs:
  Track:
    Height:         8px
    Border-radius:  4px
    Background:     #E6E0D4

  Fill:
    Border-radius:  4px
    Background:     Gradient based on value:
                    0-30%:  error (#C13A31)
                    31-69%: warning (#C17E2F)
                    70%+:   success (#2D7D46)
    Transition:     width 300ms ease

  Label (right-aligned):
    Font:           mono-sm
    Color:          text-secondary
    Format:         "{score}/{threshold}"
```

### 5.5 Navigation

#### Sidebar
```
┌──────────────────────────────┐
│                              │
│  ◆ Umbral                    │  ← Wordmark, Styrene Medium 18px
│                              │
│  ─────────────────────────   │  ← Divider, 1px #E6E0D4
│                              │
│  ◎  Dashboard                │  ← Active: bg accent-subtle, text accent
│  ◇  Operatives               │  ← Default: text-secondary
│  ◈  Grill Me                 │
│  ▣  Terminal                 │
│  ◫  C4 Model                 │
│  ◧  Policies                 │
│                              │
│                              │
│                              │
│  ─────────────────────────   │
│                              │
│  SYSTEM STATUS               │  ← Overline style
│                              │
│  CDR   0.15                  │  ← mono-sm, text-secondary
│  Gates ✓ 3/3                 │
│                              │
│  SESSIONS                    │
│  ● terminal-a4f2   2m ago    │  ← Active session with dot
│  ○ grill-bc31      done      │  ← Completed session
│                              │
└──────────────────────────────┘

Specs:
  Container:
    Width:          260px
    Height:         100vh
    Position:       fixed left
    Background:     #FAFAF5 (slightly warmer than content area)
    Border-right:   1px solid #E6E0D4
    Padding:        24px 16px
    Display:        flex, flex-direction column

  Brand area:
    Height:         48px
    Margin-bottom:  24px
    Align:          center vertically

  Nav items:
    Height:         40px
    Padding:        10px 12px
    Border-radius:  8px
    Font:           label-md (Inter Medium 13px)
    Color:          text-secondary (#6B6560)
    Icon:           20px, same color, margin-right 10px
    Transition:     background 150ms ease, color 150ms ease

  Nav item states:
    :hover          bg #EDE8DD, color text-primary
    :active (current page)
                    bg accent-subtle (#F5E6DE)
                    color accent-text (#B85C3A)
                    font-weight 600
                    icon color matches text

  System status section:
    Position:       fixed bottom of sidebar
    Padding-top:    16px
    Border-top:     1px solid #E6E0D4

  Session list:
    Max 3 visible, "+N more" link if more
    Each item:
      Height:       32px
      Font:         mono-xs
      Dot:          6px, color by status
      Time:         caption, text-tertiary, right-aligned

Interaction:
  - Click nav item: route navigation (Next.js Link), no page reload
  - Active item: highlighted with accent-subtle background
  - Session click: navigates to that session's view
  - Responsive (< 640px): sidebar collapses to 48px width, only icons visible
  - Collapsed state: hover expands item to show label as tooltip
  - Keyboard: Tab through items, Enter to navigate
```

### 5.6 Terminal Components

#### Terminal Container (Dark Context)
```
┌─ Terminal Bar ────────────────────────────────────────┐
│ ● ● ●   session: a4f2e831     ● connected            │
├──── Tab Bar ──────────────────────────────────────────┤
│ ┌─ claude ─┐  ┌─ pwsh ─┐  ┌─ + ─┐                   │
├───────────────────────────────────────────────────────┤
│                                                       │
│  PS C:\project> claude                                │
│                                                       │
│  ╭─────────────────────────────────────────────╮      │
│  │ Claude Code v1.2.3                          │      │
│  │                                             │      │
│  │ > What would you like to work on?           │      │
│  ╰─────────────────────────────────────────────╯      │
│                                                       │
│                                                       │
│  █                                                    │
│                                                       │
└───────────────────────────────────────────────────────┘

CRT scanline overlay (subtle, 3% opacity)
```

#### Terminal Bar
```
┌───────────────────────────────────────────────────────┐
│ ● ● ●     session: a4f2e831        ● connected       │
└───────────────────────────────────────────────────────┘

Specs:
  Height:         36px
  Background:     #252420
  Border-bottom:  1px solid #3A3832
  Padding:        0 14px
  Display:        flex, align-items center, justify-content space-between
  Font:           mono-xs (IBM Plex Mono 11px)

  Traffic lights (left):
    Flex container, gap 8px
    Each dot:
      Size:         12px × 12px
      Border-radius: 50%
      Border:       1px solid rgba(0,0,0,0.3)
    Red (close):    bg #EC5B56
    Yellow (min):   bg #F3BC4F
    Green (max):    bg #66C45A

  Session ID (center):
    Font:           mono-xs
    Color:          #E8E4DD, opacity 0.6
    Format:         "session: {id.slice(0, 8)}"

  Status (right):
    Dot:            6px, color by connection status
    Label:          mono-xs, same color as dot

Interaction:
  - Red dot click: sends "detach" message, calls DELETE endpoint, closes terminal
    - Confirmation: no confirm dialog (matches native terminal behavior)
  - Yellow dot click: no action (decorative, matching macOS convention)
  - Green dot click: no action (decorative)
  - Red dot hover: dot brightens slightly (opacity 1), cursor pointer
  - Yellow/Green hover: no change (cursor default)
```

#### Terminal Tab Bar
```
┌─ claude ─┐  ┌─ pwsh ─┐  ┌─ + ─┐

Specs:
  Container:
    Height:         32px
    Background:     #1A1915
    Border-bottom:  1px solid #3A3832
    Padding:        0 8px
    Display:        flex, align-items flex-end
    Gap:            2px

  Tab (inactive):
    Height:         28px
    Padding:        6px 16px
    Background:     transparent
    Color:          #9B9590
    Font:           mono-xs
    Border-radius:  6px 6px 0 0
    Border:         1px solid transparent

  Tab (active):
    Background:     #252420
    Color:          #E8E4DD
    Border-color:   #3A3832 #3A3832 transparent

  Tab close (×):
    Size:           14px × 14px
    Color:          #6B6560
    Margin-left:    8px
    Visibility:     visible on hover only

  New tab (+):
    Width:          32px
    Height:         28px
    Background:     transparent
    Color:          #6B6560
    Font-size:      16px
    Border-radius:  6px 6px 0 0

  New tab states:
    :hover          bg #252420, color #E8E4DD

Interaction:
  - Click tab: switches terminal view to that session (no WebSocket reconnect, tabs share connections)
  - Click ×: closes that session (detach + DELETE endpoint)
  - Click +: opens "New Session" dropdown (shell selector + EDE context, same as TerminalLauncher but inline)
  - Drag tab: reorder (optional, low priority)
  - Middle-click tab: close (standard browser convention)
  - Max visible tabs: 8, then scroll with ◀ ▶ arrows
```

#### Terminal Body (xterm.js)
```
Specs:
  Background:     #1A1915
  Font:           IBM Plex Mono, 13px
  Padding:        8px
  Flex:           1 (fills remaining vertical space)
  Min-height:     400px
  Position:       relative (for overlay)
  Cursor:         text (within terminal)

  xterm theme mapping (Anthropic-aligned):
    background:         #1A1915
    foreground:         #E8E4DD
    cursor:             #DA7756
    cursorAccent:       #1A1915
    selectionBackground: rgba(218, 119, 86, 0.25)
    black:              #252420
    red:                #E05252
    green:              #5BAB6E
    yellow:             #D4A04A
    blue:               #6A8FD4
    magenta:            #9B7DCF
    cyan:               #5BB8C9
    white:              #E8E4DD
    brightBlack:        #504B44
    brightRed:          #F09070
    brightGreen:        #89C997
    brightYellow:       #DA7756
    brightBlue:         #8AAAE0
    brightMagenta:      #B9A3E0
    brightCyan:         #7DD0DF
    brightWhite:        #F5F0E8

  CRT scanline overlay:
    Position:           absolute, inset 0
    Pointer-events:     none
    Background:         repeating-linear-gradient(
                          180deg,
                          rgba(255,255,255,0.015) 0,
                          rgba(255,255,255,0.015) 1px,
                          transparent 1px,
                          transparent 3px
                        )
    Mix-blend-mode:     overlay
    Opacity:            0.5

Interaction:
  - All keyboard input: forwarded to PTY via WebSocket { type: "input", data }
  - Resize: ResizeObserver triggers FitAddon.fit() + WebSocket { type: "resize", cols, rows }
  - Links: WebLinksAddon makes URLs clickable (opens in new tab)
  - Selection: click-drag selects text, Ctrl+C copies selection
  - Paste: Ctrl+V pastes from clipboard
  - Scroll: mouse wheel scrolls terminal buffer
```

### 5.7 Modals & Overlays

#### Confirmation Modal
```
┌───────────────────────────────────────────┐
│                                           │
│  ◆ Kill Session?                          │
│                                           │
│  This will terminate the terminal session │
│  and any running processes.               │
│                                           │
│          ┌─────────┐  ┌──────────┐        │
│          │ Cancel  │  │  Kill    │        │
│          └─────────┘  └──────────┘        │
│                                           │
└───────────────────────────────────────────┘

Specs:
  Overlay:
    Background:     rgba(26, 26, 26, 0.4)
    Backdrop-filter: blur(4px)
    Z-index:        50

  Modal:
    Background:     #FFFFFF
    Border-radius:  16px
    Padding:        32px
    Width:          min(440px, 90vw)
    Box-shadow:     0 8px 32px rgba(26, 26, 26, 0.12)
    Animation:      fadeIn 200ms ease + scale(0.96 → 1)

  Title:
    Font:           heading-lg (Inter SemiBold 18px)
    Color:          text-primary
    Margin-bottom:  8px

  Description:
    Font:           body-md
    Color:          text-secondary
    Margin-bottom:  24px

  Actions:
    Display:        flex, justify-content flex-end, gap 12px
    Cancel button:  secondary style
    Confirm button: danger or primary style depending on action

Interaction:
  - Escape key: closes modal (same as Cancel)
  - Click overlay: closes modal
  - Focus trap: Tab cycles through Cancel and Confirm buttons only
  - Enter key: triggers focused button
  - Animation out: fadeOut 150ms + scale(1 → 0.96)
```

#### Toast / Notification
```
┌───────────────────────────────────────────┐
│  ✓  Session created successfully          │
└───────────────────────────────────────────┘

Specs:
  Position:       fixed, bottom 24px, right 24px
  Background:     #FFFFFF
  Border:         1px solid #E6E0D4
  Border-radius:  10px
  Padding:        12px 16px
  Box-shadow:     0 4px 12px rgba(26, 26, 26, 0.08)
  Font:           body-sm
  Color:          text-primary
  Max-width:      380px
  Z-index:        100

  Icon (left):
    Size:           18px
    Margin-right:   10px
    Colors:
      success:      #2D7D46
      error:        #C13A31
      warning:      #C17E2F
      info:         #3B6FCA

  Close button (right):
    Icon-button style, 24px × 24px
    Visible on hover only

Animation:
  Enter:          translateX(100%) → translateX(0), 300ms ease-out
  Exit:           translateX(0) → translateX(100%), 200ms ease-in
  Auto-dismiss:   5000ms (success/info), no auto-dismiss (error/warning)
  Stack:          multiple toasts stack vertically with 8px gap
```

---

## 6. Page Layouts & Wireframes

### 6.1 Global Shell

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │              CONTENT AREA                          │
│  260px   │              max 1020px, centered                  │
│  fixed   │              padding: 40px top, 32px horizontal    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Background:     #F5F0E8 (entire viewport)
Sidebar bg:     #FAFAF5
Content bg:     #F5F0E8

Exception: /terminal page uses full-width dark background (#1A1915)
           with no max-width constraint
```

### 6.2 Dashboard (`/`)

```
┌──────────┬────────────────────────────────────────────────────┐
│ ◆ Umbral │                                                    │
│          │  Dashboard                         ← display-lg    │
│ ──────── │  Project governance overview       ← body-md       │
│          │                                    text-secondary   │
│ ◎ Dash   │                                                    │
│ ◇ Ops    │  ┌──────────────┬──────────────┬──────────────┐    │
│ ◈ Grill  │  │  CDR Score   │  Active      │  Gate        │    │
│ ▣ Term   │  │              │  Sessions    │  Status      │    │
│ ◫ C4     │  │  0.15        │  2           │  ✓ 3/3      │    │
│ ◧ Policy │  │  ▼ trending  │  ● active    │  all pass    │    │
│          │  └──────────────┴──────────────┴──────────────┘    │
│          │                                                    │
│          │  C4 Architecture                   ← heading-lg    │
│ ──────── │  ┌────────────────────────────────────────────┐    │
│ STATUS   │  │                                            │    │
│ CDR 0.15 │  │  C4 Model (compact view, grouped by layer) │    │
│ Gates ✓  │  │  4 layer rows, elements as pills           │    │
│          │  │                                            │    │
│ SESSIONS │  └────────────────────────────────────────────┘    │
│ ● t-a4f2 │                                                    │
│ ○ g-bc31 │  Recent Activity                   ← heading-lg    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  EDE-002 updated — 5m ago                  │    │
│          │  │  Grill session completed (score: 78) — 12m │    │
│          │  │  Terminal session started — 2m ago          │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Metric cards:
  - 3 cards in a row, equal width
  - Gap: 20px
  - Each card: Metric Card component (see 5.3)

C4 Architecture section:
  - Compact version of C4Viewer
  - 4 horizontal rows (one per C4 layer)
  - Elements displayed as pills within each row
  - SSE connection indicator at top-right of section
  - Click "View full model" link → navigates to /c4

Recent Activity section:
  - List of 5 most recent events
  - Each row: icon (type) + description + relative timestamp
  - Icons: ◇ (EDE change), ◈ (Grill), ▣ (Terminal), ◫ (C4 regen)
  - Timestamp: text-tertiary, right-aligned
  - Click row → navigates to relevant page

Interaction:
  - Metric cards: informational, no click action
  - C4 section: click opens /c4 full view
  - Activity items: click navigates to relevant page
  - Auto-refresh: C4 via SSE, metrics via polling (30s interval)
```

### 6.3 Operatives (`/operatives`)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  Operatives                        ← display-lg    │
│          │  Explicit Structure Decisions       ← body-md       │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ 🔍 Search EDEs...    │ All ▾ │ Status ▾ │  │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│          │  │ ┌──┐ ANCHOR  │  │ ┌──┐ ANCHOR  │  │ ┌──┐ NAV │ │
│          │  │ │T3│ Persist │  │ │T3│ PaC DSL │  │ │T2│ Doc │ │
│          │  │ └──┘ EDE-000 │  │ └──┘ EDE-001 │  │ └──┘ 002 │ │
│          │  │              │  │              │  │          │ │
│          │  │ "Use SQLite  │  │ "Policy as   │  │ "DocRe.. │ │
│          │  │  via better  │  │  Code DSL..."│  │  gen as. │ │
│          │  │  sqlite3..." │  │              │  │  .."     │ │
│          │  │              │  │              │  │          │ │
│          │  │ ACCEPTED  v1 │  │ ACCEPTED  v1 │  │ ACCEP v1 │ │
│          │  └──────────────┘  └──────────────┘  └──────────┘ │
│          │                                                    │
│          │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│          │  │ ...          │  │ ...          │  │ ...      │ │
│          │  └──────────────┘  └──────────────┘  └──────────┘ │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Filter bar:
  Container:
    Background:     #FFFFFF
    Border:         1px solid #E6E0D4
    Border-radius:  10px
    Padding:        8px 12px
    Margin-bottom:  24px
    Display:        flex, gap 12px, align-items center

  Search input:
    Flex:           1
    Border:         none
    Background:     transparent
    Font:           body-md
    Placeholder:    "Search EDEs..."
    Icon:           magnifying glass, 16px, text-tertiary, left

  Filter dropdowns:
    Level filter:   "All" / "Explorer" / "Navigator" / "Anchor"
    Status filter:  "All" / "Accepted" / "Proposed" / "Deprecated"
    Style:          ghost button with chevron-down
    Active filter:  accent-primary text

Card grid:
  Display:        grid
  Columns:        repeat(auto-fill, minmax(340px, 1fr))
  Gap:            20px

Empty state (no EDEs match):
  Centered vertically and horizontally
  Icon:           ◇ outline, 48px, text-tertiary
  Title:          heading-md, "No operatives found"
  Description:    body-md, text-secondary, "Index EDEs via POST /api/edes or adjust your filters."

Interaction:
  - Search: filters cards in real-time (debounce 200ms)
  - Filter dropdown: toggles filter, updates grid instantly
  - Card click: navigates to /operatives/{edeId}
  - Cards animate in: staggered fade-in on page load (50ms delay per card)
```

### 6.4 Operative Detail (`/operatives/[edeId]`)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  ← Back to Operatives              ← ghost button │
│          │                                                    │
│          │  ┌────┐                                            │
│          │  │ T3 │  ANCHOR                                    │
│          │  └────┘  Persistence Layer                         │
│          │          EDE-000                                    │
│          │          ACCEPTED  v1                               │
│          │                                                    │
│          │  ┌─────────┬────────────┬───────────┬────────┐     │
│          │  │ Decision│ Contracts  │ Tests     │ History│     │
│          │  └─────────┴────────────┴───────────┴────────┘     │
│          │                                                    │
│          │  ── Decision tab (active) ──────────────────────   │
│          │                                                    │
│          │  What & How                         ← heading-md   │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ Decision: Use SQLite via better-sqlite3    │    │
│          │  │ Mechanism: Embedded, local-first, zero     │    │
│          │  │           external dependencies            │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  Why                                ← heading-md   │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ Rationale: Local-first, no external deps.  │    │
│          │  │ Alternatives considered: (none)            │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  Anti-Patterns (PROHIBITED)         ← heading-md   │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ ✕  No usar PostgreSQL                      │    │
│          │  │ ✕  No usar ORMs pesados                    │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Header section:
  Same layout as EDE card but full-width, no max-width
  Complexity badge: 48px × 48px
  Status + version badges below title

Tab bar:
  Container:
    Border-bottom:  1px solid #E6E0D4
    Margin-bottom:  24px
    Display:        flex, gap 0

  Tab:
    Padding:        12px 20px
    Font:           label-md
    Color:          text-secondary
    Border-bottom:  2px solid transparent
    Cursor:         pointer

  Tab active:
    Color:          accent-text (#B85C3A)
    Border-bottom:  2px solid #DA7756

  Tab hover:
    Color:          text-primary
    Background:     #EDE8DD

Tabs content:
  "Decision" tab:
    - What & How section: card with decision + mechanism
    - Why section: card with rationale + alternatives + references
    - Anti-Patterns section: card with red × icon per anti-pattern, bg error-subtle
    - What's Next section: card with continuations + open questions

  "Contracts" tab:
    - Layer contracts list: each contract as a row with L1→L2 format
    - Verified by: list of verification methods

  "Tests" tab:
    - Unit tests list
    - Sad paths list
    - Coverage target: progress bar + percentage

  "History" tab:
    - Provenance info: phase, slice, createdBy, dates
    - Version history (if tracked)

Interaction:
  - Back button: navigates to /operatives
  - Tab click: switches tab content (client-side, no route change)
  - Tab content: read-only display
  - Anti-pattern items: hover highlights with error-subtle background
```

### 6.5 Grill Me (`/grill`)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  Grill Me                           ← display-lg   │
│          │  Alignment session — the AI interrogates           │
│          │  before allowing design                            │
│          │                                                    │
│          │  ── Before session starts ──────────────────────   │
│          │                                                    │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │                                              │  │
│          │  │  Select the EDE to evaluate                  │  │
│          │  │                                              │  │
│          │  │  ┌──────────────────────────────────── ▾ ┐   │  │
│          │  │  │ EDE-000 — Persistence Layer            │  │  │
│          │  │  └────────────────────────────────────────┘   │  │
│          │  │                                              │  │
│          │  │  ┌────────────────────────────────────────┐   │  │
│          │  │  │        Start Grill Session             │   │  │
│          │  │  └────────────────────────────────────────┘   │  │
│          │  │                                              │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Starter card:
  Container:
    Background:     #FFFFFF
    Border:         1px solid #E6E0D4
    Border-radius:  16px
    Padding:        40px
    Max-width:      480px
    Margin:         0 auto
    Box-shadow:     0 1px 3px rgba(26, 26, 26, 0.04)

  Label:
    Font:           label-md
    Color:          text-secondary
    Margin-bottom:  8px

  Select:
    Full width, standard select component

  Button:
    Primary button, full width
    Margin-top:     16px

Interaction:
  - Select EDE: dropdown with all EDEs listed as "{id} — {title}"
  - Click "Start Grill Session": POST /api/grill { edeId }
  - Button enters loading state: spinner + "Starting..."
  - On success: starter card slides out, GrillPanel slides in (300ms ease)
  - On error: toast notification with error message
```

#### Grill Session (Active)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  Grill Me — EDE-000                 ← display-lg   │
│          │  Persistence Layer                                 │
│          │                                                    │
│          │  Alignment Score                                   │
│          │  ████████████████░░░░░░░░░░  65/70                 │
│          │  IN PROGRESS                        ← badge blue   │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  NAVIGATOR — persistence                   │    │
│          │  │                                            │    │
│          │  │  "¿Qué mecanismo de migración usarías si   │    │
│          │  │   necesitas alterar el schema después de    │    │
│          │  │   que usuarios ya tienen datos?"            │    │
│          │  │                                            │    │
│          │  │  Your answer: "Migraciones secuenciales    │    │
│          │  │  con rollback automático..."               │    │
│          │  │                                            │    │
│          │  │  ┌──────┐                                  │    │
│          │  │  │85/100│ "Excelente comprensión de..."    │    │
│          │  │  └──────┘                                  │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  ANCHOR — boundaries                       │    │
│          │  │                                            │    │
│          │  │  "¿Por qué SQLite y no PostgreSQL para     │    │
│          │  │   este caso específico?"                    │    │
│          │  │                                            │    │
│          │  │  ┌────────────────────────────────┐ ┌────┐ │    │
│          │  │  │ Your answer...                 │ │Send│ │    │
│          │  │  └────────────────────────────────┘ └────┘ │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ── Override section (conditional) ─────────────   │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ ⚠ Can't align? You can override, but it   │    │
│          │  │   will be recorded as cognitive debt.       │    │
│          │  │                                            │    │
│          │  │   ┌──────────────────────────────────┐     │    │
│          │  │   │  Override (register debt)         │     │    │
│          │  │   └──────────────────────────────────┘     │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Score bar:
  Container:
    Margin-bottom:  32px

  Label + value:
    Display:        flex, justify-content space-between
    Label font:     label-sm, text-secondary
    Value font:     mono-md, text-primary (bold)

  Bar:
    Height:         8px
    Border-radius:  4px
    Track bg:       #E6E0D4
    Fill:           gradient based on percentage
                    0-40%:  error
                    41-69%: warning
                    70%+:   success
    Transition:     width 300ms ease

  Status badge:
    Below progress bar, margin-top 8px
    Uses standard badge component
    IN PROGRESS: info variant
    ALIGNED: success variant
    OVERRIDDEN: warning variant
    BLOCKED: error variant

Question cards:
  Container:
    Background:     #FFFFFF (unanswered) / #FAFAF5 (answered)
    Border:         1px solid #E6E0D4
    Border-radius:  12px
    Padding:        24px
    Margin-bottom:  16px
    Transition:     background-color 300ms ease

  Cognitive level tag:
    Font:           overline
    Color:          cognitive-level color
    Format:         "{LEVEL} — {topic}"

  Question text:
    Font:           body-lg (16px)
    Color:          text-primary
    Line-height:    1.6
    Margin:         12px 0 16px

  Answer display (if answered):
    Font:           body-sm
    Color:          text-secondary
    Prefix:         "Your answer:" in label-sm, text-tertiary
    Margin-bottom:  12px

  Score badge (if answered):
    Display:        inline-flex
    Padding:        4px 12px
    Border-radius:  20px
    Font:           mono-sm, bold
    Colors:
      ≥70: bg success-subtle, text success
      50-69: bg warning-subtle, text warning
      <50: bg error-subtle, text error
    Format:         "{score}/100"

  Feedback text (if answered):
    Font:           body-sm
    Color:          text-secondary
    Margin-top:     8px
    Italic:         yes

  Input area (if unanswered):
    Display:        flex, gap 12px
    Input:          standard text input, flex 1
    Button:         primary button, "Send"
    Button loading: "..." text

Override section:
  Container:
    Background:     warning-subtle (#FFF3E0)
    Border:         1px solid #C17E2F
    Border-radius:  12px
    Padding:        20px
    Margin-top:     24px

  Warning icon:     ⚠ in warning color, 18px
  Warning text:     body-sm, text-secondary
  Override button:  danger button variant (outlined #C17E2F)
  Visibility:       only when alignmentScore > 0 and session not done

Debt notice (after override):
  Container:
    Background:     warning-subtle
    Border:         1px solid #C17E2F
    Border-radius:  12px
    Padding:        16px
    Margin-top:     16px

  Text:
    Font:           body-sm
    Color:          warning (#C17E2F)
    Format:         "Cognitive debt recorded: gap of {threshold - score} points."

Interaction:
  - Type answer + press Enter or click "Send": POST /api/grill/{sessionId}/answer
  - Answer submitting: button shows "...", input disabled
  - On answer received: card transitions to answered state (bg change + score appears, 300ms)
  - Progress bar updates with each answer (animated fill)
  - When aligned (score ≥ threshold): status badge flips to ALIGNED (success, green)
  - Override click: POST /api/grill/{sessionId}/override
  - Override success: status flips to OVERRIDDEN, debt notice appears
  - Scroll: new questions auto-scroll into view (smooth scroll)
```

### 6.6 Terminal (`/terminal`)

The terminal page is a **full-bleed dark view** — no max-width constraint, no cream background. The sidebar remains light but the content area switches to dark.

```
┌──────────┬────────────────────────────────────────────────────┐
│          │ ██████████████████ DARK BACKGROUND ████████████████│
│ SIDEBAR  │                                                    │
│ (light)  │  ── If no session active ──────────────────────    │
│          │                                                    │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │            (dark card #252420)                │  │
│          │  │                                              │  │
│          │  │  Launch Terminal                              │  │
│          │  │                                              │  │
│          │  │  Shell                                        │  │
│          │  │  ┌────────────────────────────────── ▾ ┐      │  │
│          │  │  │ Claude Code                          │     │  │
│          │  │  └──────────────────────────────────────┘     │  │
│          │  │                                              │  │
│          │  │  EDE Context (optional)                       │  │
│          │  │  ┌────────────────────────────────── ▾ ┐      │  │
│          │  │  │ All EDEs                             │     │  │
│          │  │  └──────────────────────────────────────┘     │  │
│          │  │                                              │  │
│          │  │  ┌────────────────────────────────────────┐   │  │
│          │  │  │          Launch Terminal               │   │  │
│          │  │  └────────────────────────────────────────┘   │  │
│          │  │                                              │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                    │
│          │                                                    │
│          │  ── If session active ─────────────────────────    │
│          │                                                    │
│          │  ┌─ Terminal Bar ──────────────────────────────┐   │
│          │  │ ● ● ●   session: a4f2e831   ● connected    │   │
│          │  ├─ Tab Bar ──────────────────────────────────┤   │
│          │  │ ┌─ claude ─┐  ┌─ + ─┐                     │   │
│          │  ├────────────────────────────────────────────┤   │
│          │  │                                            │   │
│          │  │  $ claude                                  │   │
│          │  │                                            │   │
│          │  │  (xterm.js, full remaining height)         │   │
│          │  │                                            │   │
│          │  │                                            │   │
│          │  │                                            │   │
│          │  │                                            │   │
│          │  │  █                                         │   │
│          │  │                                            │   │
│          │  └────────────────────────────────────────────┘   │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Terminal launcher (dark variant):
  Container:
    Background:     #252420
    Border:         1px solid #3A3832
    Border-radius:  12px
    Padding:        32px
    Max-width:      440px
    Margin:         0 auto

  Title:
    Font:           heading-lg
    Color:          #E8E4DD

  Labels:
    Font:           label-sm
    Color:          #9B9590

  Inputs (dark variant):
    Background:     #1A1915
    Border:         1px solid #3A3832
    Color:          #E8E4DD
    Focus border:   #DA7756

  Launch button:
    Primary button style
    Full width

Terminal container:
  Border:         1px solid #3A3832
  Border-radius:  12px
  Overflow:       hidden
  Height:         calc(100vh - 120px) (fills viewport minus page padding)
  Display:        flex, flex-direction column

Interaction:
  - Launch flow: select shell → optional EDE context → click Launch
  - POST /api/terminal/sessions returns sessionId + wsPort + config
  - TerminalPanel renders with WebSocket connection
  - Typing: all keystrokes forwarded to PTY
  - Resize: ResizeObserver + FitAddon auto-adjusts
  - Kill (red dot): detach WS + DELETE session + return to launcher
  - New tab (+): opens inline dropdown for new session config
  - Tab switch: focuses different session (WebSocket per session)
  - Reconnection: if WS drops, auto-reconnect with exponential backoff (1s, 2s, 4s, max 30s)
```

### 6.7 C4 Model (`/c4`)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  C4 Architecture                    ← display-lg   │
│          │  Auto-generated from EDEs           ← body-md      │
│          │                                    ● SSE connected │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ SYSTEM (L5)                     #6366F1    │    │
│          │  │                                            │    │
│          │  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│          │  │ │ frontend │  │ api      │  │ persist  │  │    │
│          │  │ │ React    │  │ Next.js  │  │ SQLite   │  │    │
│          │  │ │          │  │ Routes   │  │          │  │    │
│          │  │ │ → api    │  │ → orch   │  │          │  │    │
│          │  │ └──────────┘  └──────────┘  └──────────┘  │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ CONTAINER (L4)                  #0EA5E9    │    │
│          │  │                                            │    │
│          │  │ ┌──────────┐  ┌──────────┐                │    │
│          │  │ │ element  │  │ element  │                │    │
│          │  │ └──────────┘  └──────────┘                │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ COMPONENT (L2/L3)               #10B981    │    │
│          │  │ ...                                        │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ CODE (L1)                       #DA7756    │    │
│          │  │ ...                                        │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  Last updated: 2 minutes ago                       │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Layer cards:
  Container:
    Background:     #FFFFFF
    Border:         1px solid #E6E0D4
    Border-left:    4px solid {layer-color}
    Border-radius:  12px
    Padding:        20px
    Margin-bottom:  16px
    Transition:     border-color 300ms ease

  Layer title:
    Font:           heading-md
    Color:          {layer-color}
    Text-transform: uppercase

  Elements grid:
    Display:        flex, flex-wrap wrap, gap 12px

  Element card:
    Background:     #F5F0E8
    Border:         1px solid #E6E0D4
    Border-radius:  8px
    Padding:        12px 16px
    Min-width:      160px

    Name:           label-md, text-primary
    Description:    caption, text-secondary
    Relationships:  mono-xs, text-tertiary, format "→ {target}"

  Flash animation (on C4 regen):
    Affected layer cards: border-left pulses to full opacity
    Duration:       800ms
    Easing:         ease-in-out
    Keyframes:
      0%:   border-left-color at 40% opacity
      50%:  border-left-color at 100% opacity
      100%: border-left-color at 40% opacity

SSE status:
  Position:       top-right of header area
  Uses standard status dot + label

Interaction:
  - Real-time updates via SSE (/api/events)
  - Layer flash on C4RegenTrigger event
  - Element click: no action (read-only visualization)
  - Trigger manual regen: POST /api/doc-regen (developer/debug action)
  - Status dot: green when SSE connected, red when disconnected
```

### 6.8 Policies (`/policies`)

```
┌──────────┬────────────────────────────────────────────────────┐
│          │                                                    │
│ SIDEBAR  │  Policies                           ← display-lg   │
│          │  Active governance policies         ← body-md      │
│          │  derived from EDEs                                 │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │ 12 active policies from 8 EDEs             │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  ALLOW                                     │    │
│          │  │  ──────────────────────────────────────    │    │
│          │  │  ● Use better-sqlite3 for persistence      │    │
│          │  │    Source: EDE-000                          │    │
│          │  │  ● Use FTS5 for full-text search           │    │
│          │  │    Source: EDE-000                          │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  DENY                                      │    │
│          │  │  ──────────────────────────────────────    │    │
│          │  │  ✕ No PostgreSQL                           │    │
│          │  │    Source: EDE-000                          │    │
│          │  │  ✕ No heavy ORMs (Prisma, TypeORM)         │    │
│          │  │    Source: EDE-000                          │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌────────────────────────────────────────────┐    │
│          │  │  REQUIRE APPROVAL                          │    │
│          │  │  ──────────────────────────────────────    │    │
│          │  │  ⊘ Schema migrations require review        │    │
│          │  │    Source: EDE-000                          │    │
│          │  └────────────────────────────────────────────┘    │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘

Policy groups:
  ALLOW:
    Header bg:      success-subtle
    Header text:    success
    Icon:           ● (filled circle)

  DENY:
    Header bg:      error-subtle
    Header text:    error
    Icon:           ✕ (cross)

  REQUIRE_APPROVAL:
    Header bg:      warning-subtle
    Header text:    warning
    Icon:           ⊘ (circle with line)

  Policy item:
    Font:           body-md
    Padding:        12px 16px
    Border-bottom:  1px solid #E6E0D4 (between items)
    Source link:    mono-xs, text-tertiary, clickable → /operatives/{edeId}

Interaction:
  - Source link click: navigates to the EDE that generated this policy
  - Policies are derived (read-only), no edit UI
  - Page loads by calling derivePoliciesFromEde() for all accepted EDEs
```

---

## 7. Animations & Transitions

### 7.1 Page Transitions

```
Route change (via Next.js App Router):
  Content area fades: opacity 1 → 0, 100ms ease
  New content:        opacity 0 → 1, 200ms ease, 50ms delay
  No layout shift (sidebar remains static)
```

### 7.2 Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button | :hover | background-color 150ms ease |
| Button | :active | transform scale(0.98) 100ms |
| Card | :hover | translateY(-1px) + shadow increase, 150ms ease |
| Badge | mount | fade-in 200ms |
| Progress bar | value change | width 300ms ease |
| Toast | enter | translateX(100% → 0) 300ms ease-out |
| Toast | exit | translateX(0 → 100%) 200ms ease-in |
| Modal | enter | opacity 0→1 + scale(0.96→1) 200ms ease |
| Modal | exit | opacity 1→0 + scale(1→0.96) 150ms ease |
| Dropdown | open | opacity 0→1 + translateY(-4px→0) 150ms ease-out |
| Dropdown | close | opacity 1→0 100ms ease-in |
| Tab content | switch | crossfade 200ms |
| C4 flash | SSE event | border pulse 800ms ease-in-out |
| EDE cards | page load | staggered fade-in, 50ms per card |
| Status dot | connecting | pulse (opacity 1↔0.4) 1.5s infinite |
| Scanline | constant | no animation (static overlay) |

### 7.3 Loading States

```
Page loading:
  Skeleton screens matching the page layout
  Background:     #E6E0D4
  Shimmer:        linear-gradient sweep left→right
                  rgba(255,255,255,0) → rgba(255,255,255,0.3) → rgba(255,255,255,0)
  Duration:       1.5s infinite
  Border-radius:  matches target element

Button loading:
  Text replaced with:
    - Spinner (16px CSS border-spinner, 2px accent-primary)
    - "Loading..." text after spinner, gap 8px
  Button disabled during loading

Terminal connecting:
  Background:     #1A1915
  Center text:    "Connecting..." in mono-md, #9B9590, pulse animation
  Once connected: text fades out, terminal content fades in
```

---

## 8. Iconography

Use **Lucide Icons** (open source, consistent with Anthropic's clean aesthetic).

### 8.1 Navigation Icons (20px)

| Route | Icon | Lucide Name |
|-------|------|-------------|
| Dashboard | ◎ | `layout-dashboard` |
| Operatives | ◇ | `hexagon` |
| Grill Me | ◈ | `flame` |
| Terminal | ▣ | `terminal-square` |
| C4 Model | ◫ | `layers` |
| Policies | ◧ | `shield-check` |

### 8.2 Action Icons (16px)

| Action | Icon | Lucide Name |
|--------|------|-------------|
| Search | 🔍 | `search` |
| Filter | | `filter` |
| Close | | `x` |
| Chevron down | | `chevron-down` |
| Back | | `arrow-left` |
| Plus (new) | | `plus` |
| Kill/Stop | | `square` |
| Check | | `check` |
| Warning | | `alert-triangle` |
| Error | | `alert-circle` |
| Info | | `info` |
| External link | | `external-link` |
| Copy | | `copy` |

### 8.3 Status Icons (12px)

| Status | Icon | Color |
|--------|------|-------|
| Success/Aligned | `check-circle` | success |
| Warning/Override | `alert-triangle` | warning |
| Error/Blocked | `x-circle` | error |
| In progress | `loader` (animated rotate) | info |
| Idle | `circle` (outlined) | muted |

---

## 9. Responsive Behavior

### 9.1 Breakpoint Adaptations

#### < 640px (mobile)
- Sidebar: collapses to bottom tab bar (48px height, 5 icon tabs)
- Cards: single column, full width
- Terminal: full viewport height, no padding
- Grill questions: input and button stack vertically
- Metric cards: stack vertically

#### 640px – 768px (tablet)
- Sidebar: icon-only mode (48px width), expands on hover to 260px with overlay
- Cards: single column
- Terminal: full width within content area

#### 768px – 1024px
- Sidebar: full 260px
- Cards: 2 columns
- Terminal: full width

#### > 1024px
- Sidebar: full 260px
- Cards: 2-3 columns (auto-fill, minmax 340px)
- Content: max-width 1020px, centered

### 9.2 Terminal Responsive

The terminal is always full-bleed dark regardless of viewport width. On mobile (<640px), the terminal fills 100vh minus the bottom tab bar (48px). xterm.js FitAddon handles column/row recalculation on resize.

---

## 10. Accessibility

### 10.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | All text meets WCAG AA (4.5:1 normal, 3:1 large) |
| Focus indicators | 2px solid accent-primary outline, 2px offset on all interactive elements |
| Keyboard navigation | Full tab order through sidebar → content, Enter to activate |
| Screen reader | Semantic HTML (nav, main, article, section), aria-labels on icons |
| Reduced motion | @media (prefers-reduced-motion: reduce) disables all animations |
| Focus trap | Modals trap focus, Escape closes |
| Skip link | "Skip to main content" link visible on Tab from page top |

### 10.2 Terminal Accessibility

- xterm.js has limited screen reader support — add a "Screen reader mode" toggle that pipes terminal output to an aria-live region
- Terminal font size: user-adjustable via Ctrl+= / Ctrl+- (standard browser zoom)
- High contrast: respect prefers-contrast media query for terminal theme

---

## 11. Design Tokens Summary

All values should be exported as CSS custom properties for consistency:

```css
:root {
  /* Colors */
  --color-bg-base: #F5F0E8;
  --color-bg-surface: #EDE8DD;
  --color-bg-elevated: #E6E0D4;
  --color-bg-muted: #D9D2C5;
  --color-bg-inverse: #1A1915;
  --color-bg-overlay: #2C2B26;

  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6560;
  --color-text-tertiary: #9B9590;
  --color-text-inverse: #F5F0E8;
  --color-text-disabled: #C5BFB5;

  --color-accent-primary: #DA7756;
  --color-accent-hover: #C4674A;
  --color-accent-pressed: #B05A40;
  --color-accent-subtle: #F5E6DE;
  --color-accent-text: #B85C3A;

  --color-success: #2D7D46;
  --color-success-subtle: #E8F5E9;
  --color-warning: #C17E2F;
  --color-warning-subtle: #FFF3E0;
  --color-error: #C13A31;
  --color-error-subtle: #FDECEA;
  --color-info: #3B6FCA;
  --color-info-subtle: #E3EDFB;

  /* Typography */
  --font-display: 'Styrene A Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', 'SF Mono', 'Cascadia Code', 'Consolas', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(26, 26, 26, 0.04);
  --shadow-md: 0 4px 12px rgba(26, 26, 26, 0.08);
  --shadow-lg: 0 8px 32px rgba(26, 26, 26, 0.12);

  /* Transitions */
  --transition-fast: 100ms ease;
  --transition-normal: 150ms ease;
  --transition-slow: 300ms ease;

  /* Layout */
  --sidebar-width: 260px;
  --sidebar-collapsed: 48px;
  --content-max-width: 1020px;
}
```

---

## 12. File Delivery Checklist for Claude Design

When handing this spec to Claude Design, request these deliverables:

1. **Component library** — Every component from Section 5 as a reusable design
2. **Page designs** — Full pixel-perfect layouts for all 7 pages (Sections 6.2–6.8)
3. **Interactive prototype** — Click-through flow for:
   - Dashboard → Operatives → EDE Detail
   - Grill Me: select EDE → answer questions → aligned/overridden
   - Terminal: launch → type commands → kill session
4. **Responsive variants** — Each page at 375px, 768px, 1280px
5. **Dark terminal context** — Full terminal page in dark mode
6. **Animation specs** — Motion design for all items in Section 7
7. **Design tokens file** — Exportable JSON/CSS of all values in Section 11
8. **Icon set** — All Lucide icons at 12px, 16px, 20px in both primary and muted colors

---

*End of specification*
