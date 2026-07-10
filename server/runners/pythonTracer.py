import sys
import json
import io
import traceback
import builtins
import copy

# ─── Captured output buffer ────────────────────────────────────────────────────
_output_lines = []
_original_print = builtins.print

def _capture_print(*args, **kwargs):
    sep = kwargs.get('sep', ' ')
    end = kwargs.get('end', '\n')
    text = sep.join(str(a) for a in args) + end
    _output_lines.append(text)

builtins.print = _capture_print

# ─── Trace data ───────────────────────────────────────────────────────────────
steps = []
call_stack = []

def _safe_serialize(obj, depth=0):
    """Convert Python objects to JSON-safe form."""
    if depth > 5:
        return '<max depth>'
    if obj is None or isinstance(obj, (bool, int, float, str)):
        return obj
    if isinstance(obj, (list, tuple)):
        return [_safe_serialize(v, depth + 1) for v in obj[:50]]
    if isinstance(obj, dict):
        return {str(k): _safe_serialize(v, depth + 1) for k, v in list(obj.items())[:30]}
    if isinstance(obj, set):
        return list(_safe_serialize(v, depth + 1) for v in list(obj)[:30])
    try:
        # Try to represent as dict (dataclass, namedtuple, etc.)
        return {'__type__': type(obj).__name__, '__repr__': repr(obj)[:100]}
    except Exception:
        return str(obj)[:100]

def _get_locals(frame):
    """Extract safe local variables from a frame."""
    local_vars = {}
    skip = {'__builtins__', '__doc__', '__name__', '__package__', '__spec__',
            '__loader__', '__file__', '__cached__', '_capture_print', '_original_print',
            '_output_lines', 'steps', 'call_stack', '_safe_serialize', '_get_locals',
            '_tracer', '__tracer_inject__'}
    for k, v in frame.f_locals.items():
        if k not in skip and not k.startswith('__tracer'):
            try:
                local_vars[k] = _safe_serialize(v)
            except Exception:
                local_vars[k] = '<unserializable>'
    return local_vars

def _tracer(frame, event, arg):
    filename = frame.f_code.co_filename
    # Only trace user code (not this wrapper)
    if filename != '<user_code>':
        return _tracer

    line = frame.f_lineno
    func = frame.f_code.co_name

    if event == 'call':
        call_stack.append({'function': func, 'line': line})
    elif event == 'return':
        if call_stack:
            call_stack.pop()

    # Capture current stdout output so far
    current_output = ''.join(_output_lines)

    step = {
        'line': line,
        'event': event,
        'variables': _get_locals(frame),
        'callStack': list(call_stack),
        'output': current_output,
        'returnValue': _safe_serialize(arg) if event == 'return' else None,
    }
    steps.append(step)
    return _tracer

# ─── Execute user code ────────────────────────────────────────────────────────
USER_CODE = """__USER_CODE_PLACEHOLDER__"""

sys.settrace(_tracer)
try:
    exec(compile(USER_CODE, '<user_code>', 'exec'))
except Exception as e:
    tb = traceback.format_exc()
    steps.append({
        'line': -1,
        'event': 'exception',
        'variables': {},
        'callStack': list(call_stack),
        'output': ''.join(_output_lines),
        'error': str(e),
        'traceback': tb,
    })
finally:
    sys.settrace(None)

# ─── Output result ────────────────────────────────────────────────────────────
builtins.print = _original_print
result = {
    'steps': steps,
    'finalOutput': ''.join(_output_lines),
}
print(json.dumps(result))
