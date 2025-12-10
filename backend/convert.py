import sys
import yoga.model

if len(sys.argv) < 3:
    print("Usage: python convert.py <input_file> <output_file>")
    sys.exit(1)

input_file = sys.argv[1]
output_file = sys.argv[2]

print(f"Converting {input_file} to {output_file}...")

try:
    yoga.model.optimize(input_file, output_file, options={
        "output_format": "glb"
    })
    print("Conversion successful.")
except Exception as e:
    print(f"Error during conversion: {e}")
    sys.exit(1)
