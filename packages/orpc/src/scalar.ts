import { createServer } from "node:http";
import { createContext } from "./lib/context";
import { apiHandler } from "./api";

const server = createServer(async (req, res) => {
  const apiResult = await apiHandler.handle(req, res, {
    context: await createContext(req.headers),
    prefix: "/api",
  });

  if (apiResult.matched) {
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

server.listen(7000, "127.0.0.1", () => {
  console.log("Scalar running on port 7000");
});
