---
description: Specific procedure for identifying memory leaks
---

# Debug Leak Workflow

Procedure for finding and fixing memory leaks in Node/Browser.

## Step 1: Confirm Leak
- **Monitor**: Check memory usage over time (`process.memoryUsage()` or Chrome DevTools).
- **Pattern**: Does it grow indefinitely under load?

## Step 2: Heap Snapshot
- **Action**: Capture allocation profile.
- **Analyze**: Look for detached DOM nodes or unclosed event listeners.

## Step 3: Trace References
- **Search**: Who is holding the reference?
- **Code Scan**: Check `addEventListener` without `removeEventListener`, or global caches.

## Step 4: Fix & Verify
- **Implement**: Break the reference cycle or cleanup properly.
- **Validate**: Run load test again to confirm stable memory.

## Step 5: Session Summary
- **Output**: Leak source identified and patched.
