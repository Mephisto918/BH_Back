export type Status =
  | 'idle'        // nothing happening
  | 'active'      // in-progress / active state
  | 'inactive'    // inactive or disabled
  | 'completed'   // finished successfully
  | 'error'       // some error occurred
  | 'pending'     // waiting for something
  | 'cancelled';  // operation aborted

// specialized for async operations
export type AsyncStatus = Extract<Status, 'idle' | 'pending' | 'completed' | 'error' | 'cancelled'> | 'loading' | 'succeeded' | 'failed';
