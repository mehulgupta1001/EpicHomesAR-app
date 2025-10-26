# AR Technical Notes

Epic Homes AR current technical status and key challenges.

- Current branch: Pure React Native (non-Expo) for native AR module support.  
- AR framework: react-native-ar-viewer (ViroAR alternative) for scene rendering and anchors.  
- Key challenges: persistent anchors across sessions, occlusion on low-tier Android devices, and performance/latency trade-offs for older hardware.  
- Next steps: implement robust anchor persistence, optimize scene polygon counts, and run a small field test with 3–5 demo families to validate usability and performance.