# Valentine Surprise

Open `index.html` in a browser to run the static site.

Features:
- Heart-dodge mini-game (press Space or click to jump). If a heart hits the player, you get a popup: "You lose, now you will have to marry me".
- Memories slideshow with fade animation.
- Propose page where the **No** button runs away when you try to hover click it.

# Valentine Surprise

Open `index.html` in a browser to run the static site.

## Features

1. **Game Page** (`index.html`):
   - T-Rex-style runner game with heart obstacles
   - Press Space or click to jump
   - Tap to Start with 3-second countdown
   - When you lose: "Try Again" or "Proceed Ahead" to next page
   - Supports custom PNG characters (player, shooter, hearts) — place them in `assets/`

2. **Propose Page** (`propose.html`):
   - Large question: "So, will you marry me now??"
   - Evasive "No" button (runs away when you try to click)
   - "Yes" button grows over 3.5 minutes until it covers the screen
   - When Yes is clicked: celebration video plays on loop (with sound)
   - "Proceed Ahead" button to move to memories
   - Video is sized at 35% width with rounded corners and proper spacing

3. **Memories Page** (`memories.html`):
   - Horizontal photo strip slideshow (right to left)
   - 45-second full cycle (10 photos = ~4.5 seconds per image)
   - Auto-loops continuously
   - Message textarea on the right for your custom note to her

## Asset Placeholders

Placeholder images are included in `assets/`:
- `memory1.jpg` through `memory10.jpg` — colored placeholders with "Memory N" text

**Replace these with your photos:**
- Replace `memory1.jpg`..`memory10.jpg` with your actual photo files
- Or add more up to `memory15.jpg` and update `memories.html` to include them

## Custom Game Characters

The game supports custom PNG images:
- `assets/player.png` — your character (female)
- `assets/shooter.png` — shooting character (male)
- `assets/heart.png` — heart obstacle
If images aren't found, the game uses colored rectangles as fallback.

## Celebration Video

Place your celebration video at:
- `assets/celebrate.mp4` — plays on loop with sound when "Yes" is clicked

## Quick Start

```bash
# 1. Open the game page in a browser
# Windows: open index.html in your browser

# 2. Add your assets:
# - Replace memory*.jpg files with your photos
# - Add celebrate.mp4 for the celebration video
# - (Optional) Add custom PNG images for game characters

# 3. Customize text:
# - Edit the message textarea on memories.html
# - Edit questions/titles in propose.html
```

## Architecture

- **index.html** + **game.js** — Game logic with canvas rendering
- **propose.html** + **propose.js** — Proposal interaction
- **memories.html** + **memories.js** — Slideshow animation
- **styles.css** — All styling (responsive, pink/Valentine theme)
- **assets/** — Images and video files

## Notes

- No build step required; works as a static site
- Fully responsive design (mobile-friendly)
- All animations use CSS transitions and requestAnimationFrame for smooth performance

Enjoy! ❤️
