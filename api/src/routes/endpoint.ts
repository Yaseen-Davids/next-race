import express, { Request, Response, NextFunction } from "express";

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const indexEndpoint =
  <T>(all: () => Promise<T[]>) =>
  async (req: Request, res: Response) => {
    const data = await all();
    return res.json(data);
  };

export const showEndpoint =
  <T>(findBy: (value: any, key?: string) => Promise<T>) =>
  async (req: Request, res: Response) => {
    const data = await findBy(req.params.id, req.query.key);
    return res.json(data);
  };

export const findAllEndpoint =
  <T>(findAll: (value: any, key?: string) => Promise<T>) =>
  async (req: Request, res: Response) => {
    const data = await findAll(req.params.id, req.query.key || "id");
    return res.json(data);
  };

export const updateEndpoint =
  <T>(update: (id: string, data: Partial<T>) => Promise<string>) =>
  async (req: Request, res: Response) => {
    try {
      const data = await update(req.params.id, req.body);
      return res.json(data);
    } catch (error) {
      return res.json({ data: (error as any).message });
    }
  };

export const upsertEndpoint =
  <T>(upsert: (data: Partial<T>) => Promise<string>) =>
  async (req: Request, res: Response) => {
    try {
      const data = await upsert(req.body);
      return res.json(data);
    } catch (error) {
      return res.json({ data: (error as any).message });
    }
  };

export const createEndpoint =
  <T>(create: (data: Partial<T>) => Promise<string>) =>
  async (req: Request, res: Response) => {
    try {
      const data = await create(req.body.data);
      return res.json(data);
    } catch (error) {
      return res.json({ data: (error as any).message });
    }
  };

export const removeEndpoint =
  (remove: (id: string) => Promise<void>) =>
  async (req: Request, res: Response) => {
    try {
      await remove(req.params.id);
      return res.json({});
    } catch (error) {
      return res.json({ data: (error as any).message });
    }
  };

const maybe = (middleware?: MiddlewareFunction) =>
  middleware || ((req, res, next) => next());

// //////// BASE ENDPOINT ////////
// GET /
// GET /:id
// PUT /:id
// POST /
// DELETE /:id
// POST /upsert/

export const endpoint = <T>(
  {
    all,
    findBy,
    update,
    create,
    remove,
    upsert,
    findAll,
  }: {
    all: () => Promise<T[]>;
    findBy: (value: any, key?: string) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<string>;
    create: (data: Partial<T>) => Promise<string>;
    remove: (id: string) => Promise<void>;
    upsert: (data: Partial<T>) => Promise<string>;
    findAll: (value: any, key?: string) => Promise<T[]>;
  },
  validators: any = {}
) => {
  const endpoint = express.Router();
  // endpoint.get("/all/:id", maybe(validators.findAll), findAllEndpoint(findAll));
  endpoint.get("/", maybe(validators.all), indexEndpoint(all));
  endpoint.get("/single/:id", maybe(validators.findBy), showEndpoint(findBy));
  endpoint.get("/all/:id", maybe(validators.findAll), showEndpoint(findAll));
  endpoint.put("/:id", maybe(validators.update), updateEndpoint(update));
  endpoint.post("/", maybe(validators.create), createEndpoint(create));
  endpoint.delete("/:id", maybe(validators.remove), removeEndpoint(remove));
  endpoint.post("/upsert/", maybe(validators.upsert), upsertEndpoint(upsert));
  return endpoint;
};
