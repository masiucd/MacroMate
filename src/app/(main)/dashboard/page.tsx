import {cookies} from "next/headers";

import {redis} from "@/db/redis";
import {decrypt} from "@/lib/utils/jwt";

export default async function DashboardPage() {
  await checkAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Saepe, blanditiis! Pariatur earum perferendis id quasi beatae
        reprehenderit temporibus? Dolore nobis maxime ut aspernatur
        sit voluptas quam et consequuntur, dicta eius?
      </p>
    </div>
  );
}

async function checkAuth() {
  let cookieStore = cookies();
  let session = cookieStore.get("session");
  console.log("session", session);
  if (!session) {
    return null;
  }
  let decrypted = await decrypt(session?.value);
  console.log("decrypted", decrypted);
  let result = await redis.getex(`session:${session}`);
  if (result?.length === 0) {
    return null;
  }
  console.log("result", result);

  return session;
}
