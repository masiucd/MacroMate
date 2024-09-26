import {type JWTPayload, jwtVerify, SignJWT} from "jose";
import {z} from "zod";

const algorithm = "HS256";
const key = new TextEncoder().encode("secret");

let payloadSchema = z.object({
  userId: z.number(),
  email: z.string(),
  expires: z.string(),
});

// type Payload = z.infer<typeof payloadSchema>;
export async function encrypt(payload: JWTPayload) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({alg: algorithm})
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error encrypting payload", error);
    return null;
  }
}

export async function decrypt(encrypted: string) {
  try {
    let {payload} = await jwtVerify(encrypted, key, {
      algorithms: [algorithm],
    });

    let res = payloadSchema.safeParse(payload);
    if (!res.success) {
      return null;
    }
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error decrypting payload", error);
    return null;
  }
}
