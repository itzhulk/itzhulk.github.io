from PIL import Image, ImageDraw
import os

# Create assets folder if it doesn't exist
os.makedirs('my_project/assets', exist_ok=True)

# Create 10 placeholder memory images with Valentine theme colors
colors = [
  '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5',
  '#FF1493', '#FF69B4', '#DB7093', '#C71585', '#FF00FF'
]

for i in range(1, 11):
  # Create image with pink/red Valentine theme
  img = Image.new('RGB', (400, 300), color=tuple(int(colors[i-1][j:j+2], 16) for j in (1, 3, 5)))
  draw = ImageDraw.Draw(img)
  
  # Add text to image
  text = f'Memory {i}'
  draw.text((100, 140), text, fill='white')
  
  # Save image
  img.save(f'my_project/assets/memory{i}.jpg', 'JPEG', quality=85)
  print(f'Created memory{i}.jpg')

print("All placeholder images created successfully!")
