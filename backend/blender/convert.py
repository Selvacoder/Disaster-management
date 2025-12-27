import bpy
import sys

# Get blueprint path
blueprint = sys.argv[-1]

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Add blueprint image
bpy.ops.object.load_reference_image(filepath=blueprint)

# Create floor
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.object

# Create wall
bpy.ops.mesh.primitive_cube_add(size=1)
wall = bpy.context.object
wall.scale = (5, 0.1, 3)

# Earthquake animation
wall.location.x = 0
wall.keyframe_insert(data_path="location", frame=1)
wall.location.x = 0.2
wall.keyframe_insert(data_path="location", frame=20)

# Export
bpy.ops.export_scene.gltf(filepath="output/building.glb")
