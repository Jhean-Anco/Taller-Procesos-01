from importlib import util
from pathlib import Path

module_path = Path(__file__).resolve().parents[1] / "ai-service" / "main.py"
spec = util.spec_from_file_location("safeschool_ai_service", module_path)
if spec is None or spec.loader is None:
    raise RuntimeError("No se pudo cargar ai-service/main.py")

module = util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app
