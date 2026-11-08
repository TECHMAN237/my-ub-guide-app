# UB Compass journey

A silent six-second welcome illustration, 720 × 760 at 24fps. Abstract compass artwork represents programme choice, application and student life; it is not a geographic map. Labels remain in React for English and French.

The stroke-draw pattern comes from the HyperFrames `svg-line-draw-loader` registry component; artwork and timeline are customized for UB Compass. GSAP is bundled locally under assets.

Run `npm run check`, then `npm run render -- --output ../../public/assets/compass-journey.mp4 --fps 24 --workers 2` in this directory. The app uses the SVG still under reduced motion or if video fails. No sound.
