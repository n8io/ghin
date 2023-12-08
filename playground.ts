import { GhinClient } from "./src";

(async () => {
  const ghinClient = new GhinClient({
    password: process.env["GHIN_PASSWORD"] as string,
    username: process.env["GHIN_USERNAME"] as string,
  });

  console.log(
    await ghinClient.handicaps.getOne(
      Number(process.env["GHIN_USERNAME"] as string)
    )
  );
})();
