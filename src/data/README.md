# Data Directory

This directory contains all mock data used throughout the application. The data is organized into separate files for better maintainability and easier future integration with real APIs.

## Files

- **`offers.js`** - Mock offer data for the main application dashboard (10 sample offers)
- **`chainThemes.js`** - Styling configuration for different blockchain networks (BASE, BTC, ARB, CELO, SOL, MATIC, ETH)
- **`stats.js`** - Protocol statistics data used in Hero and Stats sections
  - `protocolStats` - Detailed statistics for the Protocol Statistics section
  - `heroStats` - Key metrics displayed in the hero section
- **`features.jsx`** - Feature cards data with icons and descriptions (6 features)
- **`steps.js`** - How It Works section step-by-step data (4 steps)
- **`index.js`** - Central export file for all data modules

## Usage

Import data from the central index file:

```javascript
import { offers, chainThemes, protocolStats, heroStats, features, steps } from './data';
```

Or import specific data files directly:

```javascript
import { offers } from './data/offers';
import { chainThemes } from './data/chainThemes';
```

## Future Integration

When ready to integrate with real APIs:

1. Create API service files (e.g., `services/api.js`)
2. Replace static exports with async functions that fetch from APIs
3. Update components to handle loading states and errors
4. Keep these mock files for development/testing purposes
