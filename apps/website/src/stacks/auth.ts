import { type AuthOptions, UserSession } from "@stacks/connect-react";

export const userSession = new UserSession();
export const authOptions: AuthOptions = {
  appDetails: {
    icon: "https://placekitten.com/200/200",
    name: "THA wallet",
  },
  onFinish() {
    // FIXME: do something other than reload to get stacks auth state
    window.location.reload();
  },
  userSession,
};
