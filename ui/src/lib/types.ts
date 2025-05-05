export type Car = {
  id?: string;
  name: string;
  class: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type EventType = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  status: string;
};
