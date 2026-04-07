# 3D Models Directory

## Placeholder Model

Currently using a procedural box geometry as a placeholder for laptop models.

## To add real laptop models:

1. Download free laptop models from:
   - Sketchfab: https://sketchfab.com/search?q=laptop&type=models&features=downloadable
   - TurboSquid Free: https://www.turbosquid.com/Search/3D-Models/free/laptop
   - CGTrader Free: https://www.cgtrader.com/free-3d-models/laptop

2. Convert to GLB format (if needed):
   - Use Blender: File > Export > glTF 2.0 (.glb)
   - Or online converter: https://products.aspose.app/3d/conversion/obj-to-glb

3. Place GLB files here:
   - `/public/models/laptop-default.glb` (default model)
   - `/public/models/voltex-nexus-16.glb`
   - `/public/models/voltex-aer-14.glb`
   - etc.

4. Update product records in database with modelUrl field

## Recommended Models:

- MacBook Pro style: Search "macbook pro glb"
- Gaming laptop: Search "gaming laptop glb"
- Ultrabook: Search "ultrabook glb"

## Model Requirements:

- Format: GLB (binary glTF)
- Size: < 10MB per model
- Centered at origin (0, 0, 0)
- Facing forward (-Z axis)
- Scale: ~1 unit = 1 meter
