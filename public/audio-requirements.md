# Audio Requirements for Alkanes Ambient Music

The AmbientMusic component expects the following audio files in the `/public` directory:

## Recommended Free Track:
Download "monoliths.mp3" from OpenGameArt.org:
- **URL**: https://opengameart.org/content/ambientloading-screen-game-music-pack
- **License**: CC0 (Public Domain) or CC-BY 3.0 (your choice)
- **File**: monoliths.mp3 (6.4 MB)
- **Description**: Dark ambient track perfect for loading screens/menus

## Required Files:
- `monoliths.mp3` - Primary audio file (download from link above)
- `ambient-alkanes.mp3` - Fallback audio file (optional custom track)

## Audio Specifications:
- **Style**: Dark ambient, terminal/cyber atmosphere
- **Mood**: Mysterious, chemical, slightly ominous
- **Elements to include**:
  - Deep drone/pad sounds
  - Subtle terminal beeps and data transmission sounds
  - Chemical bubbling/reaction sounds (subtle)
  - Low frequency rumbles
  - Occasional glitch effects
  
- **Duration**: 2-5 minutes (will loop seamlessly)
- **Volume**: Mixed low (will play at 30% volume)
- **File size**: Keep under 2MB if possible

## Recommended Free Sources:
1. **Freesound.org** - Search for "dark ambient", "cyber ambient", "terminal sounds"
2. **Zapsplat** - Free with account
3. **YouTube Audio Library** - Free ambient tracks
4. **AI Generation** - Use Suno AI or similar to generate custom track

## Example Search Terms:
- "dark ambient loop"
- "cyberpunk terminal ambient"
- "laboratory ambient sounds"
- "data center ambience"
- "chemical reaction ambient"

## Implementation:
Once you have the audio files, simply place them in the `/public` directory:
```
/public/
  ├── ambient-alkanes.mp3
  └── ambient-alkanes.ogg
```

The music player will appear in the bottom-left corner with play/pause functionality.