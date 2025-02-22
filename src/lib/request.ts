import { UserSimpleProfile, UserSimpleProfileSchema } from "./type";


export const baseUri = (): string => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { headers } = require("next/headers");
    const host = headers().get("host");
    const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";
    return `${protocol}://${host}`;
  } else {
    return "";
  }
};

// export const fetchUser = async (): Promise<UserProfile | Error> => {
//   try {
//     const response = await fetch(`${baseURI()}/api/userProfile`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`Error fetching auth user data: ${response.status}`);
//     }
//     const data: UserProfile = await response.json();

//     return data;
//   } catch (error) {
//     return error instanceof Error
//       ? error
//       : new Error("An unknown error occurred");
//   }
// };

export const fetchUserSimple = async (): Promise<UserSimpleProfile | Error> => {
  try {
    const response = await fetch(`${baseUri()}/api/userProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(response);
      throw new Error(`Error fetching auth user data: ${response.status}`);
    }
    const data: UserSimpleProfile = await response.json();
    console.log(data);
    const validatedData = UserSimpleProfileSchema.parse(data);
    return validatedData;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
};
