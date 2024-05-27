import { AuthOptions, UserSession } from "@stacks/connect-react";
export const userSession = new UserSession();
export const authOptions: AuthOptions = {
  appDetails: {
    name: "THA wallet",
    icon: "https://placekitten.com/200/200",
  },
  userSession,
  onFinish() {
    // FIXME: do something other than reload to get stacks auth state
    window.location.reload();
  },
};
