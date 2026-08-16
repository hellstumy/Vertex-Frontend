export interface DashbaordType {
  projects: {
    total: number;
    active: number;
  };
  tasks: {
    total: number;
    completed: number;
  };
  workers: {
    total: number;
  };
  unpaidOrders: {
    total: number;
    outstandingAmount: number;
  };
  projectStatuses: {
    new: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
}
