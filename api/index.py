# api/index.py
import sys
import os

# Añadir el directorio raíz al path para que los imports funcionen
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
